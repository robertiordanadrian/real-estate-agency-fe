export const getRoleDisplayText = (role: string) => {
  switch (role) {
    case "CEO":
      return "Chief Executive Officer";
    case "MANAGER":
      return "Property Manager";
    case "TEAM_LEAD":
      return "Team Leader";
    case "AGENT":
      return "Real Estate Agent";
    default:
      return "User";
  }
};
