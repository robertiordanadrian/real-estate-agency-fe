import {
  ECategory,
  EStatus,
  ESurroundings,
  EType,
} from "@/common/enums/property/general-details.enums";

export const GeneralDetailsLabels = {
  EBuildingType: {
    "apartment-building": "Bloc",
    "house-villa": "Casa / Vila",
    commercial: "Spatiu Comercial",
  },
};

export interface IGeneralDetails {
  agentId: string | null;
  status: EStatus;
  transactionType: EType | null;
  category: ECategory | null;
  location: ILocation;
  ownerID: string | null;
}
export interface ILocation {
  city: string | null;
  street: string | null;
  number: string | null;
  latitude: number | null;
  longitude: number | null;
  zone: string | null;
  building: string | null;
  stairwell: string | null;
  apartment: string | null;
  surroundings: ESurroundings[];
}
