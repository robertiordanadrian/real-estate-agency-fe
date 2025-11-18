import {
  EAmenityGeneral,
  EAmenityHeating,
  EAmenityConditioning,
  EAmenityInternet,
  EAmenityDoublePaneWindows,
  EAmenityInteriorCondition,
  EAmenityInteriorDoors,
  EAmenityEntranceDoor,
  EAmenityShutters,
  EAmenityBlind,
  EAmenityThermalInsulation,
  EAmenityFlooring,
  EAmenityWalls,
  EAmenityUtilitySpaces,
  EAmenityKitchen,
  EAmenityFurnished,
  EAmenityMeters,
  EAmenityRealEstateFacilities,
  EAmenityAppliances,
  EAmenityMiscellaneous,
  EAmenityRealEstateServices,
  EAmenityHotelServices,
  EAmenityStreetDevelopment,
  EAmenityFeatures,
  EAmenityAccess,
  EAmenityOtherCharacteristics,
} from "@/common/enums/property/utilities.enums";

export interface IUtilities {
  amenities_general: EAmenityGeneral[];
  amenities_heating: EAmenityHeating[];
  amenities_conditioning: EAmenityConditioning[];
  amenities_internet: EAmenityInternet[];

  amenities_double_pane_windows: EAmenityDoublePaneWindows[];
  amenities_interior_condition: EAmenityInteriorCondition[];
  amenities_interior_doors: EAmenityInteriorDoors[];
  amenities_entrance_door: EAmenityEntranceDoor[];

  amenities_shutters: EAmenityShutters[];
  amenities_blind: EAmenityBlind[];
  amenities_thermal_insulation: EAmenityThermalInsulation[];
  amenities_flooring: EAmenityFlooring[];
  amenities_walls: EAmenityWalls[];

  amenities_utility_spaces: EAmenityUtilitySpaces[];

  amenities_kitchen: EAmenityKitchen[];
  amenities_furnished: EAmenityFurnished[];
  amenities_appliances: EAmenityAppliances[];
  amenities_meters: EAmenityMeters[];
  amenities_miscellaneous: EAmenityMiscellaneous[];

  amenities_real_estate_facilities: EAmenityRealEstateFacilities[];

  amenities_real_estate_services: EAmenityRealEstateServices[];
  amenities_hotel_services: EAmenityHotelServices[];

  amenities_street_development: EAmenityStreetDevelopment[];

  amenities_features: EAmenityFeatures[];

  amenities_access: EAmenityAccess[];

  amenities_other_characteristics: EAmenityOtherCharacteristics[];
}
