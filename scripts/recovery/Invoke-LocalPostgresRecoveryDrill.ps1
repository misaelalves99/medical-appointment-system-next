param(
  [string]$ContainerName = "c3-s09-recovery-postgres",
  [string]$Image = "postgres:16-alpine",
  [string]$Database = "stage09_recovery",
  [string]$User = "stage09",
  [string]$Password = "stage09-local-only"
)
$ErrorActionPreference = "Stop"
function Pg([string]$Sql) {
  & docker exec -e PGPASSWORD=$Password $ContainerName psql -U $User -d $Database -v ON_ERROR_STOP=1 -Atc $Sql
  if ($LASTEXITCODE -ne 0) { throw "psql failed" }
}
function Wait-Db {
  for($i=0;$i -lt 60;$i++){
    & docker exec -e PGPASSWORD=$Password $ContainerName pg_isready -U $User -d $Database *> $null
    if($LASTEXITCODE -eq 0){ return }
    Start-Sleep -Seconds 1
  }
  throw "Postgres readiness timeout"
}
& docker rm -f $ContainerName *> $null
& docker run -d --name $ContainerName -e "POSTGRES_DB=$Database" -e "POSTGRES_USER=$User" -e "POSTGRES_PASSWORD=$Password" $Image *> $null
if($LASTEXITCODE -ne 0){throw "docker run failed"}
try {
  Wait-Db
  Pg "CREATE TABLE recovery_probe(id integer primary key, marker text not null);"
  Pg "INSERT INTO recovery_probe(id,marker) VALUES (1,'stage09-synthetic-original');"
  $before=(Pg "SELECT marker FROM recovery_probe WHERE id=1;").Trim()
  if($before -ne "stage09-synthetic-original"){throw "seed integrity failed"}
  $backup=Join-Path $env:TEMP "c3-s09-recovery-$PID.sql"
  & docker exec -e PGPASSWORD=$Password $ContainerName pg_dump -U $User -d $Database --clean --if-exists | Set-Content $backup -Encoding UTF8
  if($LASTEXITCODE -ne 0){throw "pg_dump failed"}
  Pg "UPDATE recovery_probe SET marker='stage09-synthetic-corrupted' WHERE id=1;"
  $corrupted=(Pg "SELECT marker FROM recovery_probe WHERE id=1;").Trim()
  if($corrupted -ne "stage09-synthetic-corrupted"){throw "controlled corruption failed"}
  & docker cp $backup "${ContainerName}:/tmp/stage09-recovery.sql" *> $null
  if($LASTEXITCODE -ne 0){throw "docker cp backup failed"}
  & docker exec -e PGPASSWORD=$Password $ContainerName psql -U $User -d $Database -v ON_ERROR_STOP=1 -f /tmp/stage09-recovery.sql *> $null
  if($LASTEXITCODE -ne 0){throw "restore failed"}
  $restored=(Pg "SELECT marker FROM recovery_probe WHERE id=1;").Trim()
  if($restored -ne $before){throw "restore integrity mismatch"}
  "BACKUP_CREATED=True"
  "CONTROLLED_MUTATION_OBSERVED=True"
  "RESTORE_COMPLETED=True"
  "INTEGRITY_VERIFIED=True"
  "ORIGINAL_MARKER=$before"
  "RESTORED_MARKER=$restored"
} finally {
  if($backup -and (Test-Path $backup)){Remove-Item $backup -Force}
  & docker rm -f $ContainerName *> $null
}

