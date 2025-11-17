import { ERole } from "@/common/enums/role/role.enums";

export function normalizeRole(role: string | ERole): ERole {
  switch (role) {
    case "CEO":
    case ERole.CEO:
      return ERole.CEO;
    case "MANAGER":
    case ERole.MANAGER:
      return ERole.MANAGER;
    case "TEAM_LEAD":
    case ERole.TEAM_LEAD:
      return ERole.TEAM_LEAD;
    case "AGENT":
    case ERole.AGENT:
    default:
      return ERole.AGENT;
  }
}
