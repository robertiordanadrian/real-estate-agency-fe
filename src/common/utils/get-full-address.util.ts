import { IProperty } from "@/common/interfaces/property/property.interface";

export const getFullAddress = (p: IProperty) => {
  const loc = p.generalDetails?.location;
  if (!loc) return "-";

  const street = loc.street || "";
  const number = loc.number || "";
  const city = loc.city || "";

  const base = `${street} ${number}`.trim();
  return city ? `${base} (${city})` : base || "-";
};
