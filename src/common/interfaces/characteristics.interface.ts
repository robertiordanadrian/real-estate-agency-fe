import {
  EBuildingSeismicRisk,
  EBuildingStructure,
  EBuildingType,
  EComfort,
  ECompartmentalization,
  EConstructionStage,
  EDestination,
  EEnergyClass,
} from "../enums/characteristics.enums";

export interface ICharacteristics {
  details: IDetails;
  areas: IAreas;
  building: IBuilding;
  energyPerformance: IEnergyPerformance;
}

export interface IDetails {
  type: string;
  compartmentalization: ECompartmentalization;
  destination: EDestination;
  comfort: EComfort;
  rooms: string;
  bedrooms: string;
  kitchens: string;
  bathrooms: string;
  balconies: string;
  terraces: string;
  floor: string;
  orientare: string;
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
interface IBuilding {
  constructionStage: EConstructionStage;
  type: EBuildingType;
  structure: EBuildingStructure;
  seismicRisk: EBuildingSeismicRisk;
  height: string;
}

interface IEnergyPerformance {
  energyClass: EEnergyClass;
  specificAnnualConsumption: string;
  co2EquivalentEmissionIndex: string;
  specificConsumptionFromRenewableSources: string;
}
