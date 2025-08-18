// src/types/Address.ts

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string | null;
}
