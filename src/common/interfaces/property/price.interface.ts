import { EContractType, ESignedContract } from "@/common/enums/property/price.enums";

export interface IPrice {
  priceDetails: IPriceDetails;
  commissions: ICommissions;
  contact: IContract;
}

interface IPriceDetails {
  price: string;
  tva: boolean;
  pricePerMp: string;
  garagePrice: string;
  parkingPrice: string;
}

interface ICommissions {
  buyerCommission: string;
  buyerCommissionValue: string;
  ownerCommission: string;
  ownerCommissionValue: string;
}
interface IContract {
  type: EContractType | null;
  signedContract: ESignedContract | null;
  contractNumber: string;
  signDate: Date | null;
  expirationDate: Date | null;
  contractFile: string | File | null;
}
