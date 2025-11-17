export enum EStatus {
  GREEN = "Verde",
  YELLOW = "Galben",
  BLACK = "Negru",
  RED = "Rosu",
  BLUE = "Albastru",
  WHITE = "Alb",
  RESERVED = "Rezervata",
}

export enum EType {
  SALE = "Vanzare",
  RENT = "Inchiriere",
}

export enum ECategory {
  APARTMENT_BUILDING = "apartment-building",
  HOUSE_VILLA = "house-villa",
  COMMERCIAL = "commercial",
}

export enum ESurroundings {
  SCHOOLS = "Scoli",
  GREEN_ZONES = "Zone verzi",
  PHARMACY = "Farmacii",
  RESTAURANTS = "Restaurante",
  TRANSPORT = "Transport",
  COMERCIAL_ZONES = "Zone comerciale",
  SUBWAY = "Metrou",
  GYMS = "Sali de sport",
  COFFEE_SHOPS = "Cafenele",
}

export const ECategoryLabels: Record<ECategory, string> = {
  [ECategory.APARTMENT_BUILDING]: "Bloc / Apartament",
  [ECategory.HOUSE_VILLA]: "Casa / Vila",
  [ECategory.COMMERCIAL]: "Spatiu comercial",
};
