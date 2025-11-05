import { ELeadStatus } from "../enums/lead-status.enum";

export const getLeadStatusChipStyle = (status: string) => {
  switch (status) {
    case ELeadStatus.GREEN:
      return { bgcolor: "#22c55e", color: "#ffffff" }; // Verde
    case ELeadStatus.YELLOW:
      return { bgcolor: "#facc15", color: "#000000" }; // Galben
    case ELeadStatus.WHITE:
      return {
        bgcolor: "#ffffff",
        color: "#0f172a",
        border: "1px solid #cbd5e1",
      }; // Alb
    case ELeadStatus.RED:
      return { bgcolor: "#ef4444", color: "#ffffff" }; // Roșu
    default:
      return { bgcolor: "#94a3b8", color: "#ffffff" }; // fallback gri
  }
};
