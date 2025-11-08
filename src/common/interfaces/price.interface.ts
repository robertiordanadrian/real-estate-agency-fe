import { EContactType, ECurrency, EPaymentMethod, ESignedContract } from "../enums/price.enums";

export interface IPrice {
  priceDetails: IPriceDetails;
  commissions: ICommissions;
  contact: IContact;
}

interface IPriceDetails {
  price: string;
  currency: ECurrency;
  tva: boolean;
  pricePerMp: string;
  lastPrice?: string;
  negociablePrice: boolean;
  requestPrice: boolean;
  showPricePerMp: boolean;
  paymentMethod: EPaymentMethod;
  garagePrice: string;
  parkingPrice: string;
  privateNotePrice: string;
}

interface ICommissions {
  buyerCommission: string;
  buyerCommissionValue: string;
  ownerCommission: string;
  ownerCommissionValue: string;
}
interface IContact {
  type: EContactType;
  signedContract: ESignedContract;
  contractNumber: string;
  signDate: Date | null;
  expirationDate: Date | null;
  contractFile: string | File | null;
}
