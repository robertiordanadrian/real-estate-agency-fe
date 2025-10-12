export enum EStatus {
  ACTIV_NOT_SET = 'Activa - Not set',
  ACTIV_COLD = 'Activa - Cold',
  ACTIV_WARM = 'Activa - Warm',
  ACTIV_HOT = 'Activa - Hot',
  ACTIV_RESERVED = 'Activa - Rezervata',
  WAITING = 'In Asteptare',
  RETREAT = 'Retrasa',
  TRADED_WIN = 'Tranzactionata - Won',
  LOST = 'Pierduta - Lost',
}

export enum EType {
  SALE = 'Vanzare',
  RENT = 'Inchiriere',
}

export enum ECategory {
  APARTMENT = 'Apartament',
  HOUSE = 'Casa / Vila',
  LAND = 'Teren',
  OFFICE_SPACE = 'Spatiu birou',
  COMMERCIAL_SPACE = 'Spatiu comercial',
  INDUSTRIAL_SPACE = 'Spatiu industrial',
  HOTEL = 'Hotel / Pensiune',
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