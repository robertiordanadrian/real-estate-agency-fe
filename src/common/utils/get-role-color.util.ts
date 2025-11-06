import { blue, green, orange, red } from "@mui/material/colors";

export const getRoleColor = (role: string): string => {
  switch (role) {
    case "CEO":
      return blue[400];
    case "MANAGER":
      return orange[400];
    case "TEAM_LEAD":
      return red[400];
    case "AGENT":
    default:
      return green[400];
  }
};
