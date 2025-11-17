import {
  EContactType,
  ESignedContract,
} from "@/common/enums/property/price.enums";

export interface IPrice {
  priceDetails: IPriceDetails;
  commissions: ICommissions;
  contact: IContact;
}

interface IPriceDetails {
  price: string | null;
  tva: boolean | null;
  pricePerMp: string | null;
  garagePrice: string | null;
  parkingPrice: string | null;
}

interface ICommissions {
  buyerCommission: string | null;
  buyerCommissionValue: string | null;
  ownerCommission: string | null;
  ownerCommissionValue: string | null;
}
interface IContact {
  type: EContactType | null;
  signedContract: ESignedContract | null;
  contractNumber: string | null;
  signDate: Date | null;
  expirationDate: Date | null;
  contractFile: string | File | null;
}
