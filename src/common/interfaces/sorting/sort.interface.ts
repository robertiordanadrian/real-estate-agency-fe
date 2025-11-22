export type TSortDirection = "asc" | "desc";

export interface ISortState {
  field: string;
  direction: TSortDirection;
}
