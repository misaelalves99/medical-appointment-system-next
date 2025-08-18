// src/types/ContactInfo.ts

export interface ContactInfo {
  id: number;
  phone?: string | null;
  email?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
}
