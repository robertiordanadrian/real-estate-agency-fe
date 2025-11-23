import {
  EBuildingSeismicRisk,
  EBuildingStructure,
  EConstructionStage,
  EEnergyCertificationClass,
} from "@/common/enums/property/characteristics.enums";

export interface ICharacteristics {
  details: IDetails;
  areas: IAreas;
  building: IBuilding;
  energyPerformance: IEnergyPerformance;
}
export interface IDetails {
  rooms: string;
  bedrooms: string;
  kitchens: string;
  bathrooms: string;
  balconies: string;
  terraces: string;
  floor: string;
  yearOfConstruction: string;
  yearOfRenovation: string;
  parkingLots: string;
  garages: string;
  bathroomWindow: boolean;
  openKitchen: boolean;
  petFriendly: boolean;
  keyInAgency: boolean;
}

export interface IAreas {
  usableArea: string;
  builtupArea: string;
  totalUsableArea: string;
  balconyArea: string;
  terraceArea: string;
  gardenArea: string;
}
export interface IBuilding {
  constructionStage: EConstructionStage | null;
  structure: EBuildingStructure | null;
  seismicRisk: EBuildingSeismicRisk | null;
  basement: boolean;
  demiBasement: boolean;
  groundFloor: boolean;
  floors: number | null;
  attic: boolean;
  pod: boolean;
}
export interface IEnergyPerformance {
  energyClass: EEnergyCertificationClass | null;
  specificAnnualConsumption: string;
  co2EquivalentEmissionIndex: string;
  specificConsumptionFromRenewableSources: string;
}
