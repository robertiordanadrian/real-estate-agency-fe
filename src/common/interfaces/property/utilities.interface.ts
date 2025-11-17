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
  amenities_general: EAmenityGeneral[] | null;
  amenities_heating: EAmenityHeating[] | null;
  amenities_conditioning: EAmenityConditioning[] | null;
  amenities_internet: EAmenityInternet[] | null;

  amenities_double_pane_windows: EAmenityDoublePaneWindows[] | null;
  amenities_interior_condition: EAmenityInteriorCondition[] | null;
  amenities_interior_doors: EAmenityInteriorDoors[] | null;
  amenities_entrance_door: EAmenityEntranceDoor[] | null;

  amenities_shutters: EAmenityShutters[] | null;
  amenities_blind: EAmenityBlind[] | null;
  amenities_thermal_insulation: EAmenityThermalInsulation[] | null;
  amenities_flooring: EAmenityFlooring[] | null;
  amenities_walls: EAmenityWalls[] | null;

  amenities_utility_spaces: EAmenityUtilitySpaces[] | null;

  amenities_kitchen: EAmenityKitchen[] | null;
  amenities_furnished: EAmenityFurnished[] | null;
  amenities_appliances: EAmenityAppliances[] | null;
  amenities_meters: EAmenityMeters[] | null;
  amenities_miscellaneous: EAmenityMiscellaneous[] | null;

  amenities_real_estate_facilities: EAmenityRealEstateFacilities[] | null;

  amenities_real_estate_services: EAmenityRealEstateServices[] | null;
  amenities_hotel_services: EAmenityHotelServices[] | null;

  amenities_street_development: EAmenityStreetDevelopment[] | null;

  amenities_features: EAmenityFeatures[] | null;

  amenities_access: EAmenityAccess[] | null;

  amenities_other_characteristics: EAmenityOtherCharacteristics[] | null;
}
