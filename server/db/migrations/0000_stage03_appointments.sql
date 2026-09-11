CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" text NOT NULL,
	"practitioner_id" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE EXTENSION IF NOT EXISTS "btree_gist";
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_valid_interval" CHECK ("starts_at" < "ends_at");
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_practitioner_time_no_overlap" EXCLUDE USING gist ("practitioner_id" WITH =, tstzrange("starts_at", "ends_at", '[)') WITH &&);
