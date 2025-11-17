export enum EnergyCertificationClass {
  A = "a",
  B = "b",
  C = "c",
  D = "d",
  E = "e",
  F = "f",
  G = "g",
}

export enum Category {
  APARTMENT_SELL = 102,
  HOUSE_SELL = 106,
  COMMERCIAL_SPACE_SELL = 115,
  COMMERCIAL_SPACE_RENT = 215,
  APARTMENT_RENT = 202,
  HOUSE_RENT = 206,
}

export enum HousingType {
  APARTMENT = "apartment",
  PENTHOUSE = "penthouse",
  SINGLE_ROOM = "single-room",
  INDIVIDUAL = "individual",
  DUPLEX = "duplex",
  TRIPLEX = "triplex",
  INLINE = "inline",
  OTHERS = "others",
}

export enum BuildingType {
  APARTMENT_BUILDING = "apartment-building",
  HOUSE_VILLA = "house-villa",
  MALL = "mall",
  TERRACE = "terrace",
  STREET_SPACE = "street-space",
  SHOWROOM = "showroom",
  OFFICE_BUILDING = "office-building",
  MIXED_BUILDING = "mixed-building",
  STORAGE = "storage",
  LOGISTICS = "logistics",
  PRODUCTION_SERVICES = "production-services",
  INDUSTRIAL = "industrial",
  RESIDENTIAL = "residential",
  OFFICE = "office",
  COMMERCIAL = "commercial",
  AGRICULTURAL = "agricultural",
}

export enum CompartmentalizationType {
  SEMI_DETACHED = "semi-detached",
  DETACHED = "detached",
  NON_DETACHED = "non-detached",
  CIRCULAR = "circular",
}

export enum Comfort {
  COMFORT_1 = "1",
  COMFORT_2 = "2",
  COMFORT_3 = "3",
  LUXURY = "luxury",
}

export enum ConstructionPeriod {
  BEFORE_1941 = "before-1941",
  BETWEEN_1941_1977 = "1941-1977",
  BETWEEN_1978_1990 = "1978-1990",
  BETWEEN_1991_2000 = "1991-2000",
  BETWEEN_2001_2010 = "2001-2010",
  AFTER_2010 = "after-2010",
}

export enum ConstructionStage {
  COMPLETED = "completed",
  TO_GRAY = "to-gray",
  TO_RED = "to-red",
  UNDER_CONSTRUCTION = "under-construction",
  PROJECT = "project",
  EXIST = "exist",
}

export enum BuildingStructure {
  CONCRETE = "concrete",
  BRICK = "brick",
  BCA = "bca",
  WOOD = "wood",
  METAL = "metal",
  MORE = "more",
  CHIRPICI = "chirpici",
  MASONRY = "masonry",
  SANDWICH_WALLS = "sandwich-walls",
  BILLETS = "billets",
}

export enum RoofType {
  BOARD = "board",
  TILE = "tile",
  SHINGLES = "shingles",
}

export enum Destination {
  AGRICULTURAL = "agricultural",
  RESIDENTIAL = "residential",
  COMMERCIAL = "commercial",
  INDUSTRIAL = "industrial",
  OFFICE_SPACE = "office_space",
  OFFICE = "office",
  VACATION = "vacation",
}

export enum BuildingCondition {
  UPGRADED = "upgraded",
  MODERNIZED = "modernized",
}

export enum LandClassification {
  TOWN = "town",
  UPCOUNTRY = "upcountry",
}

export enum LandType {
  AGRICULTURAL = "agricultural",
  FOREST = "forest",
  ORCHARD = "orchard",
  GRASSLAND = "grassland",
  PASTURE = "pasture",
  POND = "pond",
  BUILDING = "building",
}

export enum UrbanCoefficientSource {
  PUG = "pug",
  CU = "cu",
  PUZ = "puz",
  PUD = "pud",
}

export enum OfficeClass {
  A = "a",
  B = "b",
  B_PLUS = "b+",
  C = "c",
  C_PLUS = "c+",
}

export enum AmenityGeneral {
  CATV = "catv",
  GAS = "gas",
  INTERNATIONAL_PHONE = "international-phone",
  PHONE = "phone",
  POWER = "power",
  SEWERAGE = "sewerage",
  WATER = "water",
  SEPTIC_TANK = "septic-tank",
  TELEPHONE_EXCHANGE = "telephone-exchange",
  THREE_PHASE_POWER = "three-phase-power",
  ELECTRICITY = "electricity",
  GASES = "gases",
  AREA_UTILITIES = "area-utilities",
  IRRIGATION_SYSTEM = "irrigation-system",
  ROAD_ACCESS = "road-access",
  AIR_CONDITIONING = "air-conditioning",
  HEATING_SYSTEM = "heating-system",
}

export enum AmenityHeating {
  OTHER_ELECTRICAL_METHODS = "other-electrical-methods",
  RADIATORS = "radiators",
  CENTRAL_BUILDING = "central-building",
  CENTRAL_HEATING = "central-heating",
  GAS_CONVECTOR = "gas-convector",
  UNDERFLOOR_HEATING = "underfloor-heating",
  INFRARED_PANELS = "infrared-panels",
  TILE_STOVE = "tile-stove",
  DISTRICT_HEATING = "district-heating",
}

export enum AmenityConditioning {
  AIR_CONDITIONING = "air-conditioning",
  AIR_HEATERS = "air-heaters",
  FAN_COIL_UNITS = "fan-coil-units",
}

export enum AmenityInternet {
  CABLE = "cable",
  OPTIC_FIBRE = "optic-fibre",
  WIRELESS = "wireless",
  DIAL_UP = "dial-up",
}

export enum AmenityDoublePaneWindows {
  PVC = "pvc",
  WOOD = "wood",
  ALUMINUM = "aluminum",
}

export enum AmenityInteriorCondition {
  RENEWED = "renewed",
  GOOD_CONDITION = "good-condition",
  NEEDS_RENOVATION = "needs-renovation",
}

export enum AmenityInteriorDoors {
  CELL_PHONES = "cell-phones",
  WOOD = "wood",
  PANEL = "panel",
  PVC = "pvc",
  GLASS = "glass",
}

export enum AmenityEntranceDoor {
  PAL = "pal",
  WOOD = "wood",
  METAL = "metal",
  PVC = "pvc",
  PARQUET = "parquet",
}

export enum AmenityShutters {
  PVC = "pvc",
  WOOD = "wood",
  ALUMINUM = "aluminum",
}

export enum AmenityBlind {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

export enum AmenityThermalInsulation {
  EXTERIOR = "exterior",
  INTERIOR = "interior",
}

export enum AmenityFlooring {
  FLOOR = "floor",
  FLOOR_TILES = "floor-tiles",
  MARBLE = "marble",
  CARPET = "carpet",
  PARQUET = "parquet",
  LINOLEUM = "linoleum",
}

export enum AmenityWalls {
  FAIENCE = "faience",
  WASHABLE_PAINT = "washable-paint",
  VINAROM = "vinarom",
  LIME = "lime",
  DIRT_CLAY = "dirt-clay",
  PANELING = "paneling",
  WALLPAPER = "wallpaper",
}

export enum AmenityUtilitySpaces {
  TERRACE = "terrace",
  SERVICE_TOILET = "service-toilet",
  BASEMENT_STORAGE = "basement-storage",
  CLOSET = "closet",
  BASEMENT = "basement",
  DRESSING = "dressing",
  CELLAR = "cellar",
  STORAGE_SPACE = "storage-space",
  DEPENDENCYES = "dependencyes",
  ANNEXES = "annexes",
}

export enum AmenityKitchen {
  FURNISHED = "furnished",
  PARTIALLY_FURNISHED = "partially-furnished",
  EQUIPPED = "equipped",
  PARTIALLY_EQUIPPED = "partially-equipped",
}

export enum AmenityFurnished {
  UNFURNISHED = "unfurnished",
  PARTIAL = "partial",
  COMPLETE = "complete",
  LUXURY = "luxury",
}

export enum AmenityMeters {
  GAS_METER = "gas-meter",
  WATER_METER = "water-meter",
  HEAT_METER = "heat-meter",
}

export enum AmenityRealEstateFacilities {
  LEISURE_AREAS = "leisure-areas",
  GARDEN = "garden",
  DRYER = "dryer",
  OUTDOOR_POOL = "outdoor-pool",
  INDOOR_POOL = "indoor-pool",
  ELEVATOR = "elevator",
  INTERCOM = "intercom",
  ROOF = "roof",
  YARD = "yard",
  COMMON_YARD = "common-yard",
  VIDEO_INTERCOM = "video-intercom",
  SAUNA = "sauna",
  SPA = "spa",
  DECORATED_GARDEN = "decorated-garden",
}

export enum AmenityAppliances {
  DVD = "dvd",
  IRON = "iron",
  COFFEE_MAKER = "coffee-maker",
  HAIR_DRYER = "hair-dryer",
  TOASTER = "toaster",
  HI_FI = "hi-fi",
  WASHING_MACHINE = "washing-machine",
  SANDWICH_MAKER = "sandwich-maker",
  FRIDGE = "fridge",
  MICROWAVE = "microwave",
  STOVE = "stove",
  HOOD = "hood",
  DISHWASHER = "dishwasher",
  KITCHEN_ROBOT = "kitchen-robot",
  VACUUM_CLEANER = "vacuum-cleaner",
  TV = "tv",
}

export enum AmenityMiscellaneous {
  FIREPLACE = "fireplace",
  INTERIOR_STAIRCASE = "interior-staircase",
  JACUZZI = "jacuzzi",
  SMOKE_SENSOR = "smoke-sensor",
  ALARM_SYSTEM = "alarm-system",
  GARAGE_DOOR_REMOTE_CONTROL = "garage-door-remote-control",
  CAR_DOOR_REMOTE_CONTROL = "car-door-remote-control",
}

export enum AmenityRealEstateServices {
  ADMINISTRATION = "administration",
  HOUSEKEEPING = "housekeeping",
  SECURITY = "security",
  VIDEO_SURVEILLANCE = "video-surveillance",
}

export enum AmenityHotelServices {
  CLEANING = "cleaning",
  BED_SHEETS = "bed-sheets",
  TOWELS = "towels",
  AIRPORT_TRANSFER_STATION = "airport-transfer-station",
  CITY_TOUR = "city-tour",
}

export enum AmenityStreetDevelopment {
  ASPHALT = "asphalt",
  CONCRETE = "concrete",
  PAVING = "paving",
  DIRT_ROAD = "dirt-road",
  UNDEVELOPED = "undeveloped",
  STREET_LIGHTING = "street-lighting",
  PUBLIC_TRANSPORTATION = "public-transportation",
}

export enum AmenityFeatures {
  RAMP = "ramp",
  CRANE = "crane",
  SLIDE_BRIDGE = "slide-bridge",
  ELEVATOR = "elevator",
  HEATING_SYSTEM = "heating-system",
  LIGHTING = "lighting",
  CONDITIONING = "conditioning",
  WINDOWS_LIGHT_SOURCES = "windows-light-sources",
}

export enum AmenityAccess {
  RAILWAY = "railway",
  TRUCK_ACCESS = "truck-access",
  ROAD = "road",
}

export enum AmenityOtherCharacteristics {
  INVESTMENT_OPPORTUNITY = "investment-opportunity",
  DEMOLISHED_CONSTRUCTION = "demolished-construction",
  PLOT = "plot",
  ON_THE_ROAD = "on-the-road",
  CAR_ACCESS = "car-access",
  FENCED_LAND = "fenced-land",
}
