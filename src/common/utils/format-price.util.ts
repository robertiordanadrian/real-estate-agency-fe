export const formatPrice = (value?: number | string) => {
  if (value === null || value === undefined) return "-";

  const numeric = String(value).replace(/\D/g, "");
  if (!numeric) return "-";

  return new Intl.NumberFormat("ro-RO").format(Number(numeric));
};
