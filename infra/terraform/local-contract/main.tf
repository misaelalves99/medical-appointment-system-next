terraform {
  required_version = ">= 1.6.0"
}

variable "application_name" {
  description = "Application identifier used by the bounded local IaC contract."
  type        = string
  default     = "medical-appointment-system-next"
}

variable "environment" {
  description = "Logical environment label. This module provisions no remote infrastructure."
  type        = string
  default     = "local-evidence"
}

locals {
  contract = {
    application = var.application_name
    environment = var.environment
    purpose     = "cycle03-stage09-offline-iac-validation"
  }
}

output "contract" {
  description = "Bounded local IaC contract used only for fmt/validate/plan evidence."
  value       = local.contract
}
