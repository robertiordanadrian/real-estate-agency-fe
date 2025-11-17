export interface IModifiedField {
  fieldName: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface IModificationLogEntry {
  _id: string | null;
  date: string | null;
  agentId: string | null;
  modifiedFields: IModifiedField[] | null;
}
