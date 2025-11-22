import { EStatus } from "@/common/enums/property/general-details.enums";

export const normalizeStatus = (value: string | null): EStatus | null => {
  if (!value) return null;

  const found = Object.entries(EStatus).find(([key, label]) => label === value);
  return found ? (found[0] as EStatus) : null;
};
