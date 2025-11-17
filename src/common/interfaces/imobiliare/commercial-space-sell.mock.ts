import {
  AmenityGeneral,
  BuildingCondition,
  BuildingType,
  ConstructionStage,
  EnergyCertificationClass,
} from "@/common/enums/imobiliare/imobiliare.enums";
import { CommercialSpaceSellPayload } from "@/common/interfaces/imobiliare/imobiliare.interface";

export const COMMERCIAL_SPACE_SELL_MOCK: CommercialSpaceSellPayload = {
  value: {
    custom_reference: "test122",
    category_api: 115,
    project_id: null,
    location_id: 30024,
    street_number: "10",
    street_name: "Aradului",
    block: null,
    entrance: null,
    apartment_number: null,
    map_marker_type: "pin",
    latitude: 45.79217780667356,
    longitude: 21.208211002733417,
    price: 110000,
    price_currency: "EUR",
    agents: [121],
    title: "titlu properitate maxim 80 caractere",
    description:
      "descriere properitate minim 80 caractere descriere properitate minim 80 caractere",

    data_properties: {
      hide_exact_location: null,

      exclusive: true,
      exclusivity_valid_from: "2025-07-16 09:04:00",
      exclusivity_valid_to: "2025-07-24 09:04:00",
      collaboration: true,
      collaboration_commission_percentage: 10,
      collaboration_commission_value: 1500,
      seller_commission: "8",
      buyer_commission: "9",
      commission_zero: false,

      other_price_details: "alte detalii pret",
      price_no_vat: false,
      poa: false,

      auction_execution_stage: "amiable-sale",
      priority: null,
      hide_price: false,

      number_of_floors: "5",
      number_of_sub_terrean_floors: "10",
      year_built: "1980",

      energy_certification_class: EnergyCertificationClass.A,
      property_name: "test nume proprietate",
      energy_primary_consumption: "100",
      energy_co2_emission_index: "101",
      energy_consumption_renewable_resources: "102",

      mezzanine: true,
      building_occupancy_degree: "10",
      building_condition: BuildingCondition.UPGRADED,
      property_usage_recommendation: "investment",
      building_type: BuildingType.APARTMENT_BUILDING,
      commercial_space_type: null,
      sale_price: null,

      other_private_details: "Alte detalii private 21k caractere",
      neighborhood: "vecinatati 21k caractere",
      parking_space_count: "1",
      compartmentalization_possible: null,
      video_viewing: true,
      entresol: null,
      semi_basement: true,
      ground_floor: true,
      attic: true,
      terrace: true,

      total_usable_surface: "110",
      height_condition: null,
      construction_stage: ConstructionStage.UNDER_CONSTRUCTION,
      land_area: "500",
      year_of_modernization: "2000",

      amenities_general: [
        AmenityGeneral.AIR_CONDITIONING,
        AmenityGeneral.GAS,
        AmenityGeneral.HEATING_SYSTEM,
        AmenityGeneral.POWER,
        AmenityGeneral.SEWERAGE,
        AmenityGeneral.WATER,
      ],
    },

    space_props: [
      {
        space_description: null,
        space_name: null,
        renting_commission_percentage: "9",
        contract_expiration_date: null,
        availability_date: null,
        available_area: null,
        floor_number: null,
        minimum_divisible_area: "10",
        id: null,
        price: 110000,
        price_currency: "EUR",
        space_height: "8",
        showcase: true,
        parking_available: true,
      },
    ],
  },
};
