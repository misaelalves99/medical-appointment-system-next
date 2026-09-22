# Stage 09 bounded Terraform contract

This Terraform root intentionally has no provider and no resource blocks. It exists to prove versioned IaC syntax, validation and a deterministic no-infrastructure plan before any cloud/provider design.

Allowed in the current gate: `terraform fmt`, `terraform init -backend=false`, `terraform validate`, and `terraform plan` for this provider-free root.

Not authorized: `terraform apply`, cloud credentials, remote backends, paid resources, or live infrastructure.
