import {
  EAccounting,
  EAdditionalSpaces,
  EAirConditioning,
  EAppliances,
  EExterior,
  EFinishesEnteringDoor,
  EFinishesFlooring,
  EFinishesInsulation,
  EFinishesInteriorDoors,
  EFinishesLouver,
  EFinishesStatus,
  EFinishesWalls,
  EFinishesWindows,
  EFurnished,
  EGeneral,
  EImmobile,
  EIrigationSystem,
  EKitchen,
  ERecreationalSpaces,
} from "../enums/utilities.enums";

export interface IUtilities {
  generals: EGeneral[];
  irigationSystem: EIrigationSystem[];
  airConditioning: EAirConditioning[];
  finishes: IUtilitiesFinishes;
  equipment: IUtilitiesEquipment;
}

interface IUtilitiesEquipment {
  furnished: EFurnished[];
  additionalSpaces: EAdditionalSpaces[];
  kitchen: EKitchen[];
  accounting: EAccounting[];
  appliances: EAppliances[];
  immobile: EImmobile[];
  recreationalSpaces: ERecreationalSpaces[];
  exterior: EExterior[];
}

interface IUtilitiesFinishes {
  status: EFinishesStatus[];
  insulation: EFinishesInsulation[];
  walls: EFinishesWalls[];
  flooring: EFinishesFlooring[];
  windows: EFinishesWindows[];
  louver: EFinishesLouver[];
  enteringDoor: EFinishesEnteringDoor[];
  interiorDoors: EFinishesInteriorDoors[];
}
