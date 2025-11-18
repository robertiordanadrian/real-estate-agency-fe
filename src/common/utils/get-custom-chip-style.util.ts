import { EStatus } from "@/common/enums/property/general-details.enums";

export const getCustomChipStyle = (status: string | null) => {
  if (typeof status !== null)
    switch (status) {
      case EStatus.GREEN:
        return {
          bgcolor: "#22c55e",
          color: "#ffffff",
        };
      case EStatus.YELLOW:
        return {
          bgcolor: "#facc15",
          color: "#000000",
        };
      case EStatus.BLACK:
        return {
          bgcolor: "#1e293b",
          color: "#ffffff",
        };
      case EStatus.RED:
        return {
          bgcolor: "#ef4444",
          color: "#ffffff",
        };
      case EStatus.BLUE:
        return {
          bgcolor: "#3b82f6",
          color: "#ffffff",
        };
      case EStatus.WHITE:
        return {
          bgcolor: "#ffffff",
          color: "#0f172a",
          border: "1px solid #cbd5e1",
        };
      case EStatus.RESERVED:
        return {
          bgcolor: "#8b5cf6",
          color: "#ffffff",
        };
      default:
        return {
          bgcolor: "#94a3b8",
          color: "#ffffff",
        };
    }
};
