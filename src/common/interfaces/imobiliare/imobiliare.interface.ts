import {
  AmenityAppliances,
  AmenityBlind,
  AmenityConditioning,
  AmenityDoublePaneWindows,
  AmenityEntranceDoor,
  AmenityFlooring,
  AmenityFurnished,
  AmenityGeneral,
  AmenityHeating,
  AmenityHotelServices,
  AmenityInteriorCondition,
  AmenityInteriorDoors,
  AmenityInternet,
  AmenityKitchen,
  AmenityMeters,
  AmenityMiscellaneous,
  AmenityRealEstateFacilities,
  AmenityRealEstateServices,
  AmenityShutters,
  AmenityStreetDevelopment,
  AmenityThermalInsulation,
  AmenityUtilitySpaces,
  AmenityWalls,
  BuildingCondition,
  BuildingStructure,
  BuildingType,
  Comfort,
  CompartmentalizationType,
  ConstructionPeriod,
  ConstructionStage,
  Destination,
  EnergyCertificationClass,
  HousingType,
  RoofType,
} from "@/common/enums/imobiliare/imobiliare.enums";

export interface BaseRealEstatePayload {
  custom_reference: string;
  agents: number[];
  category_api: number;
  project_id: number | null;
  project_url?: string;
  location_id: number;
  street_number: string;
  street_name: string;
  block: string | null;
  entrance: string | null;
  apartment_number: string | null;
  map_marker_type: string;
  latitude: number;
  longitude: number;
  grid_id?: string;
  price: number;
  price_currency: string;
  title: string;
  description: string;
}

export interface BaseCommissionData {
  exclusive: boolean;
  exclusivity_valid_from?: string;
  exclusivity_valid_to?: string;
  collaboration: boolean;
  collaboration_commission_percentage: number;
  collaboration_commission_value: number;
  seller_commission: string;
  buyer_commission: string;
  commission_zero: boolean;
}

export interface BaseOpenHouseData {
  open_house_start_time?: string;
  open_house_stop_time?: string;
  open_house_address?: string;
  open_house_date?: string;
}

export interface BaseExpirationData {
  expired_at?: string;
  expired_at_time?: string;
}

export interface BasePriceData {
  other_price_details?: string;
  price_no_vat?: boolean;
  poa?: boolean | string;
}

export interface ApartmentRentDataProperties
  extends BaseCommissionData,
    BaseOpenHouseData,
    BaseExpirationData,
    BasePriceData {
  bedroom_count: string;
  floor_number: string;
  bathroom_count: string;
  number_of_floors: string;
  year_built: string;
  comfort: Comfort;
  attic: boolean;
  basement: boolean;
  semi_basement: boolean;
  ground_floor: boolean;
  usable_surface: string;
  built_area: string;
  total_usable_surface: string;
  housing_type: HousingType;
  building_type: BuildingType;
  compartmentalization_type: CompartmentalizationType;
  construction_stage: ConstructionStage;
  construction_period: ConstructionPeriod;
  video_viewing: boolean;
  pets_allowed: boolean;
  un_inhabited_property: boolean;

  amenities_general: AmenityGeneral[];
  amenities_heating: AmenityHeating[];
  amenities_conditioning: AmenityConditioning[];
  amenities_internet: AmenityInternet[];
  amenities_double_pane_windows: AmenityDoublePaneWindows[];
  amenities_interior_condition: AmenityInteriorCondition[];
  amenities_interior_doors: AmenityInteriorDoors[];
  amenities_entrance_door: AmenityEntranceDoor[];
  amenities_shutters: AmenityShutters[];
  amenities_blind: AmenityBlind[];
  amenities_thermal_insulation: AmenityThermalInsulation[];
  amenities_flooring: AmenityFlooring[];
  amenities_walls: AmenityWalls[];
  amenities_utility_spaces: AmenityUtilitySpaces[];
  amenities_kitchen: AmenityKitchen[];
  amenities_furnished: AmenityFurnished[];
  amenities_meters: AmenityMeters[];
  amenities_real_estate_facilities: AmenityRealEstateFacilities[];
  amenities_appliances: AmenityAppliances[];
  amenities_miscellaneous: AmenityMiscellaneous[];
  amenities_real_estate_services: AmenityRealEstateServices[];
  amenities_hotel_services: AmenityHotelServices[];
  amenities_street_development: AmenityStreetDevelopment[];

  energy_certification_class: EnergyCertificationClass;
  energy_primary_consumption: string;
  energy_co2_emission_index: string;
  energy_consumption_renewable_resources: string;

  other_private_details: string;
  safety_measures: string;
  neighborhood?: string;
  vices: string;
  property_availability: string;
  balcony_count: string;
  closed_balcony_count: string;
  kitchen_count: string;
  garage_count: string;
  parking_space_count: string;
  building_structure: BuildingStructure;
  other_details: string;
  destination: Destination[];
}

export interface ApartmentRentPayload {
  value: BaseRealEstatePayload & {
    data_properties: ApartmentRentDataProperties;
  };
}

export interface ApartmentSellDataProperties
  extends BaseCommissionData,
    BaseOpenHouseData,
    BaseExpirationData,
    BasePriceData {
  bedroom_count: number;
  floor_number: string;
  bathroom_count: string;
  number_of_floors: string;
  year_built: string;

  amenities_general: AmenityGeneral[];
  amenities_heating: AmenityHeating[];
  amenities_conditioning: AmenityConditioning[];
  amenities_internet: AmenityInternet[];
  amenities_double_pane_windows: AmenityDoublePaneWindows[];
  amenities_interior_condition: AmenityInteriorCondition[];
  amenities_interior_doors: AmenityInteriorDoors[];
  amenities_entrance_door: AmenityEntranceDoor[];
  amenities_shutters: AmenityShutters[];
  amenities_blind: AmenityBlind[];
  amenities_thermal_insulation: AmenityThermalInsulation[];
  amenities_flooring: AmenityFlooring[];
  amenities_walls: AmenityWalls[];
  amenities_utility_spaces: AmenityUtilitySpaces[];
  amenities_kitchen: AmenityKitchen[];
  amenities_furnished: AmenityFurnished[];
  amenities_meters: AmenityMeters[];
  amenities_real_estate_facilities: AmenityRealEstateFacilities[];
  amenities_appliances: AmenityAppliances[];
  amenities_miscellaneous: AmenityMiscellaneous[];
  amenities_real_estate_services: AmenityRealEstateServices[];
  amenities_hotel_services: AmenityHotelServices[];
  amenities_street_development: AmenityStreetDevelopment[];

  energy_certification_class: EnergyCertificationClass;
  energy_primary_consumption: string;
  energy_co2_emission_index: string;
  energy_consumption_renewable_resources: string;

  housing_type: HousingType;
  building_type: BuildingType;
  other_price_details: string;
  other_private_details: string;
  safety_measures?: string | null;
  neighborhood: string;
  vices: string;
  property_availability: string;
  balcony_count: string;
  closed_balcony_count: string;
  kitchen_count: string;
  garage_count: string;
  parking_space_count: string;
  building_structure: BuildingStructure;
  video_viewing: boolean;
  pets_allowed: boolean;
  un_inhabited_property?: boolean | null;
  other_details: string;
  compartmentalization_type: CompartmentalizationType;
  comfort: Comfort;
  construction_period: ConstructionPeriod;
  basement: boolean;
  semi_basement: boolean;
  ground_floor: boolean;
  attic: boolean;
  usable_surface: string;
  built_area: string;
  total_usable_surface: string;
  construction_stage: ConstructionStage;
  destination: Destination[];
  block_number: string;
  stair: string;
  other_area_details: string;
  hide_exact_location: boolean;
  executive_file_number: string;
}

export interface ApartmentSellPayload {
  value: BaseRealEstatePayload & {
    data_properties: ApartmentSellDataProperties;
  };
}

export interface CommercialSpaceSellDataProperties extends BaseCommissionData, BasePriceData {
  hide_exact_location?: boolean | null;
  auction_execution_stage: string;
  priority?: string | null;
  hide_price: boolean;

  number_of_floors: string;
  number_of_sub_terrean_floors: string;
  year_built: string;
  energy_certification_class: EnergyCertificationClass;
  property_name: string;
  energy_primary_consumption: string;
  energy_co2_emission_index: string;
  energy_consumption_renewable_resources: string;
  mezzanine: boolean;
  building_occupancy_degree: string;
  building_condition: BuildingCondition;
  property_usage_recommendation?: string;
  building_type: BuildingType;
  commercial_space_type?: string | null;
  sale_price?: string | null;

  other_private_details: string;
  neighborhood: string;
  parking_space_count: string;
  compartmentalization_possible?: boolean | null;
  video_viewing: boolean;
  entresol?: boolean | null;
  semi_basement: boolean;
  ground_floor: boolean;
  attic: boolean;
  terrace: boolean;
  total_usable_surface: string;
  height_condition?: string | null;
  construction_stage: ConstructionStage;
  land_area: string;
  year_of_modernization: string;

  amenities_general: AmenityGeneral[];
}

export interface SpaceProp {
  space_description?: string | null;
  space_name?: string | null;
  renting_commission_percentage: string;
  contract_expiration_date?: string | null;
  availability_date?: string | null;
  available_area?: string | null;
  floor_number?: string | null;
  minimum_divisible_area: string;
  id?: string | null;
  price: number;
  price_currency: string;
  space_height: string;
  showcase: boolean;
  parking_available: boolean;
}

export interface CommercialSpaceSellPayload {
  value: BaseRealEstatePayload & {
    data_properties: CommercialSpaceSellDataProperties;
    space_props: SpaceProp[];
  };
}

export interface CommercialSpaceRentDataProperties
  extends BaseCommissionData,
    BaseExpirationData,
    BasePriceData {
  hide_exact_location?: boolean | null;
  price_per_available_area: string;
  auction_execution_stage: string;
  priority?: string | null;
  hide_price: boolean;

  number_of_floors: string;
  number_of_sub_terrean_floors: string;
  year_built: string;
  energy_certification_class: EnergyCertificationClass;
  property_name: string;
  energy_primary_consumption: string;
  energy_co2_emission_index: string;
  energy_consumption_renewable_resources: string;
  mezzanine: boolean;
  building_occupancy_degree: string;
  building_condition: BuildingCondition;
  building_type: BuildingType;
  commercial_space_type?: string | null;
  sale_price?: string | null;

  other_private_details: string;
  neighborhood: string;
  parking_space_count: string;
  compartmentalization_possible?: boolean | null;
  video_viewing: boolean;
  entresol?: boolean | null;
  semi_basement: boolean;
  ground_floor: boolean;
  attic: boolean;
  terrace: boolean;
  total_usable_surface: string;
  height_condition?: string | null;
  construction_stage: ConstructionStage;
  land_area: string;
  year_of_modernization: string;
  partitioning_possible: boolean;
  location_is_verified?: boolean | null;

  amenities_general: AmenityGeneral[];
}

export interface CommercialSpaceRentSpaceProp extends SpaceProp {
  expired_at: string;
  expired_at_time: string;
  space_availability: string;
  maintenance_cost_added: boolean;
  price_per_available_area: string;
}

export interface CommercialSpaceRentPayload {
  value: BaseRealEstatePayload & {
    data_properties: CommercialSpaceRentDataProperties;
    space_props: CommercialSpaceRentSpaceProp[];
  };
}

export interface HouseSellDataProperties
  extends BaseCommissionData,
    BaseOpenHouseData,
    BaseExpirationData,
    BasePriceData {
  bedroom_count: string;
  bathroom_count: string;
  terrace_count: string;
  terrace_area: string;
  number_of_floors: string;

  energy_certification_class: EnergyCertificationClass;
  energy_primary_consumption: string;
  energy_co2_emission_index: string;
  energy_consumption_renewable_resources: string;

  housing_type: HousingType;
  street_front_distance: string;
  street_front_count: string;
  other_private_details: string;
  safety_measures?: string | null;
  other_area_details?: string | null;
  neighborhood: string;
  vices: string;
  property_availability: string;
  balcony_count: string;
  closed_balcony_count: string;
  kitchen_count: string;
  garage_count: string;
  parking_space_count: string;
  building_structure: BuildingStructure;
  hide_exact_location?: boolean | null;
  video_viewing: boolean;
  pets_allowed?: boolean | null;
  un_inhabited_property?: boolean | null;
  other_details: string;
  roof_type: RoofType;
  construction_period: ConstructionPeriod;
  basement: boolean;
  semi_basement: boolean;
  ground_floor: boolean;
  attic: boolean;
  usable_surface: string;
  built_area: string;
  developed_area: string;
  height_condition?: string | null;
  construction_stage: ConstructionStage;
  land_area: string;
  year_built: string;
  destination: Destination[];

  amenities_general: AmenityGeneral[];
  amenities_heating: AmenityHeating[];
  amenities_conditioning: AmenityConditioning[];
  amenities_internet: AmenityInternet[];
  amenities_double_pane_windows: AmenityDoublePaneWindows[];
  amenities_interior_condition: AmenityInteriorCondition[];
  amenities_interior_doors: AmenityInteriorDoors[];
  amenities_entrance_door: AmenityEntranceDoor[];
  amenities_shutters: AmenityShutters[];
  amenities_blind: AmenityBlind[];
  amenities_thermal_insulation: AmenityThermalInsulation[];
  amenities_flooring: AmenityFlooring[];
  amenities_walls: AmenityWalls[];
  amenities_utility_spaces: AmenityUtilitySpaces[];
  amenities_kitchen: AmenityKitchen[];
  amenities_furnished: AmenityFurnished[];
  amenities_meters: AmenityMeters[];
  amenities_real_estate_facilities: AmenityRealEstateFacilities[];
  amenities_appliances: AmenityAppliances[];
  amenities_miscellaneous: AmenityMiscellaneous[];
  amenities_real_estate_services: AmenityRealEstateServices[];
  amenities_hotel_services: AmenityHotelServices[];
  amenities_street_development: AmenityStreetDevelopment[];
}

export interface HouseSellPayload {
  value: BaseRealEstatePayload & {
    data_properties: HouseSellDataProperties;
  };
}

export interface HouseRentDataProperties
  extends BaseCommissionData,
    BaseOpenHouseData,
    BaseExpirationData,
    BasePriceData {
  year_built: string;
  housing_type: HousingType;
  bedroom_count: string;
  property_type?: string | null;
  bathroom_count: string;
  terrace_count: string;
  terrace_area: string;
  number_of_floors: string;
  video_viewing: boolean;
  pets_allowed: boolean;
  un_inhabited_property?: boolean | null;
  other_details: string;
  roof_type: RoofType;
  construction_period: ConstructionPeriod;
  basement: boolean;
  semi_basement: boolean;
  ground_floor: boolean;
  attic: boolean;
  usable_surface: string;
  built_area: string;
  developed_area: string;
  height_condition?: string | null;
  construction_stage: ConstructionStage;
  land_area: string;
  destination: Destination[];
  priority?: string | null;
}

export interface HouseRentPayload {
  value: BaseRealEstatePayload & {
    data_properties: HouseRentDataProperties;
  };
}

export type RealEstatePayload =
  | ApartmentRentPayload
  | ApartmentSellPayload
  | CommercialSpaceSellPayload
  | CommercialSpaceRentPayload
  | HouseSellPayload
  | HouseRentPayload;
