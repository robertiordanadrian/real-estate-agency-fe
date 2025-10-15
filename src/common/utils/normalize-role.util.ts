import { ERole } from "../enums/role.enums";

export function normalizeRole(role: string | ERole): ERole {
  switch (role) {
    case "CEO":
    case ERole.CEO:
      return ERole.CEO;
    case "MANAGER":
    case ERole.MANAGER:
      return ERole.MANAGER;
    case "AGENT":
    case ERole.AGENT:
    default:
      return ERole.AGENT;
  }
}
