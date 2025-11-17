import {
  EBuildingSeismicRisk,
  EBuildingStructure,
  EBuildingType,
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
  rooms: string | null;
  bedrooms: string | null;
  kitchens: string | null;
  bathrooms: string | null;
  balconies: string | null;
  terraces: string | null;
  floor: string | null;
  yearOfConstruction: string | null;
  yearOfRenovation: string | null;
  parkingLots: string | null;
  garages: string | null;
  bathroomWindow: boolean | null;
  openKitchen: boolean | null;
  petFriendly: boolean | null;
  keyInAgency: boolean | null;
}

export interface IAreas {
  usableArea: string | null;
  builtupArea: string | null;
  totalUsableArea: string | null;
  balconyArea: string | null;
  terraceArea: string | null;
  gardenArea: string | null;
}
export interface IBuilding {
  constructionStage: EConstructionStage | null;
  type: EBuildingType | null;
  structure: EBuildingStructure | null;
  seismicRisk: EBuildingSeismicRisk | null;
  basement?: boolean | null;
  demiBasement?: boolean | null;
  groundFloor?: boolean | null;
  floors?: number | null;
  attic?: boolean | null;
  pod?: boolean | null;
}

interface IEnergyPerformance {
  energyClass: EEnergyCertificationClass | null;
  specificAnnualConsumption: string | null;
  co2EquivalentEmissionIndex: string | null;
  specificConsumptionFromRenewableSources: string | null;
}
