import type { ICharacteristics } from "./characteristics.interface";
import type { IDescription } from "./description.interface";
import type { IGeneralDetails } from "./general-details.interface";
import { IModificationLogEntry } from "./modification-log.interface";
import type { IPrice } from "./price.interface";
import type { IPublish } from "./publish.interface";
import type { IUtilities } from "./utilities.interface";

export interface IProperty {
  _id?: string;
  sku?: string;
  generalDetails: IGeneralDetails;
  characteristics: ICharacteristics;
  utilities: IUtilities;
  price: IPrice;
  description: IDescription;
  images: string[];
  publish?: IPublish;
  modificationLogs: IModificationLogEntry[];
  statusStartDate?: Date;
  nextStatusDate?: Date;
  isPool?: boolean;
}
