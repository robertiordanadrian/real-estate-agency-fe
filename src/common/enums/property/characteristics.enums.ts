export enum EConstructionStage {
  COMPLETED = "completed",
  TO_GRAY = "to-gray",
  TO_RED = "to-red",
  UNDER_CONSTRUCTION = "under-construction",
  PROJECT = "project",
  EXIST = "exist",
}

export enum EComfort {
  COMFORT_1 = "1",
  COMFORT_2 = "2",
  COMFORT_3 = "3",
  LUXURY = "luxury",
}

export enum EDestination {
  RESIDENTIAL = "Rezidentiala",
  OFFICES = "Birouri",
  COMMERCIAL = "Comerciala",
  VACATION = "De vacanta",
}

export enum ECompartmentalization {
  SEMI_DETACHED = "semi-detached",
  DETACHED = "detached",
  NON_DETACHED = "non-detached",
  CIRCULAR = "circular",
}

export enum EBuildingStructure {
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

export enum EBuildingSeismicRisk {
  CLASS_I = "Clasa I",
  CLASS_II = "Clasa II",
  CLASS_III = "Clasa III",
  CLASS_IV = "Clasa IV",
  URGENCY_I = "Urgenta I",
  URGENCY_II = "Urgenta II",
  URGENCY_III = "Urgenta III",
}

export enum EEnergyCertificationClass {
  A = "a",
  B = "b",
  C = "c",
  D = "d",
  E = "e",
  F = "f",
  G = "g",
}

export const CharacteristicsEnumLabels = {
  EConstructionStage: {
    [EConstructionStage.COMPLETED]: "Finalizat",
    [EConstructionStage.TO_GRAY]: "La gri",
    [EConstructionStage.TO_RED]: "La rosu",
    [EConstructionStage.UNDER_CONSTRUCTION]: "In constructie",
    [EConstructionStage.PROJECT]: "Proiect",
    [EConstructionStage.EXIST]: "Existent",
  },

  EBuildingStructure: {
    [EBuildingStructure.CONCRETE]: "Beton",
    [EBuildingStructure.BRICK]: "Caramida",
    [EBuildingStructure.BCA]: "BCA",
    [EBuildingStructure.WOOD]: "Lemn",
    [EBuildingStructure.METAL]: "Metal",
    [EBuildingStructure.MORE]: "Structura mixta",
    [EBuildingStructure.CHIRPICI]: "Chirpici",
    [EBuildingStructure.MASONRY]: "Zidarie",
    [EBuildingStructure.SANDWICH_WALLS]: "Pereti sandwich",
    [EBuildingStructure.BILLETS]: "Bustean",
  },

  EEnergyCertificationClass: {
    [EEnergyCertificationClass.A]: "Clasa energetica A",
    [EEnergyCertificationClass.B]: "Clasa energetica B",
    [EEnergyCertificationClass.C]: "Clasa energetica C",
    [EEnergyCertificationClass.D]: "Clasa energetica D",
    [EEnergyCertificationClass.E]: "Clasa energetica E",
    [EEnergyCertificationClass.F]: "Clasa energetica F",
    [EEnergyCertificationClass.G]: "Clasa energetica G",
  },
};
