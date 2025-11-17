import { EStatus } from "@/common/enums/property/general-details.enums";

export const getChipColor = (
  status: string,
): "default" | "primary" | "secondary" | "success" | "error" | "warning" => {
  switch (status) {
    case EStatus.GREEN:
      return "success";
    case EStatus.YELLOW:
      return "warning";
    case EStatus.RED:
      return "error";
    case EStatus.BLACK:
      return "default";
    case EStatus.BLUE:
      return "primary";
    case EStatus.WHITE:
      return "secondary";
    case EStatus.RESERVED:
      return "default";
    default:
      return "default";
  }
};
