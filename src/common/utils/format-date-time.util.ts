export const formatDateTime = (iso: string | null) => {
  if (!iso) return "N/A";
  const date = new Date(iso);
  return date.toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
