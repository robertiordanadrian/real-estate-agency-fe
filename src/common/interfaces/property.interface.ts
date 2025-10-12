import type { ICharacteristics } from "./characteristics.interface";
import type { IDescription } from "./description.interface";
import type { IGeneralDetails } from "./general-details.interface";
import type { IModificationLogs } from "./modification-logs.interface";
import type { IPrice } from "./price.interface";
import type { IPublish } from "./publish.interface";
import type { IUtilities } from "./utilities.interface";

export interface IProperty {
  _id?: string;
  generalDetails: IGeneralDetails;
  characteristics: ICharacteristics;
  utilities: IUtilities;
  price: IPrice;
  description: IDescription;
  images: string[];
  publish?: IPublish;
  modificationLogs?: IModificationLogs;
}
