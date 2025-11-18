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
  agentId: string;
  status: EStatus | null;
  transactionType: EType | null;
  category: ECategory | null;
  location: ILocation;
  ownerID: string;
}
export interface ILocation {
  city: string;
  street: string;
  number: string;
  latitude: number | null;
  longitude: number | null;
  zone: string;
  building: string;
  stairwell: string;
  apartment: string;
  surroundings: ESurroundings[];
}
