// src/hooks/useSpecialty.tsx

import { useContext } from "react";
import { SpecialtyContext } from "../contexts/SpecialtyContext";

export const useSpecialty = () => useContext(SpecialtyContext);
