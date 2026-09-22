# Local PostgreSQL recovery drill

This Stage 09 exercise uses an ephemeral local PostgreSQL container and synthetic data only. It creates a logical `pg_dump`, performs a controlled data mutation, restores the dump, and verifies that the original marker is recovered.

The dump is temporary and deleted by the script. The container is removed in `finally`.

This is bounded recovery evidence, not a production backup strategy, disaster-recovery guarantee, RPO/RTO claim, cloud backup, or evidence involving real patient/health data.
