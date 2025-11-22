export interface IImobiliareSlot {
  name: string;
  total: string;
  used?: string;
}

export type IImobiliareSlotsResponse = IImobiliareSlot[];
