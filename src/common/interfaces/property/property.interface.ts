import type { ICharacteristics } from "@/common/interfaces/property/characteristics.interface";
import type { IDescription } from "@/common/interfaces/property/description.interface";
import type { IGeneralDetails } from "@/common/interfaces/property/general-details.interface";
import type { IModificationLogEntry } from "@/common/interfaces/property/modification-log.interface";
import type { IPrice } from "@/common/interfaces/property/price.interface";
import type { IUtilities } from "@/common/interfaces/property/utilities.interface";
export interface IProperty {
  _id: string;
  sku: string;
  generalDetails: IGeneralDetails;
  characteristics: ICharacteristics;
  utilities: IUtilities;
  price: IPrice;
  description: IDescription;
  images: string[];
  modificationLogs: IModificationLogEntry[];
  statusStartDate: Date | null;
  nextStatusDate: Date | null;
  isPool: boolean;
}
