import type { IBuilding } from "@/common/interfaces/property/characteristics.interface";

export function formatBuildingLevels(building: IBuilding): string {
  if (!building) return "N/A";

  const parts: string[] = [];

  if (building.basement) parts.push("S+");
  if (building.demiBasement) parts.push("D+");
  if (building.groundFloor) parts.push("P+");
  if (building.floors != null) parts.push(String(building.floors));
  if (building.attic) parts.push("M+");
  if (building.pod) parts.push("Pod");

  if (parts.length === 0) return "N/A";

  return parts.join(" ");
}
