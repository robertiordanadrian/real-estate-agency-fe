import { IGeneralDetails } from "@/common/interfaces/property/general-details.interface";
import { ICharacteristics } from "@/common/interfaces/property/characteristics.interface";
import { IUtilities } from "@/common/interfaces/property/utilities.interface";
import { IPrice } from "@/common/interfaces/property/price.interface";
import { IDescription } from "@/common/interfaces/property/description.interface";

export interface ICreatePropertyPayload {
  generalDetails: IGeneralDetails;
  characteristics: ICharacteristics;
  utilities: IUtilities;
  price: IPrice;
  description: IDescription;
}
