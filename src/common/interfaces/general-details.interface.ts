import {
  EStatus,
  EType,
  ECategory,
  ESurroundings,
} from "../enums/general-details.enums";

export interface IGeneralDetails {
  agent: string;
  status: EStatus;
  transactionType: EType;
  category: ECategory;
  ownerID: string;
  residentialComplex: string;
  location: ILocation;
  privatMemo: string;
}

export interface ILocation {
  city: string;
  zone: string;
  street: string;
  number: string;
  building: string;
  stairwell: string;
  apartment: string;
  interesPoints: string;
  surroundings: ESurroundings[];
}
