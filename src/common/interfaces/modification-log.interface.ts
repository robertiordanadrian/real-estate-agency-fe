export interface IModifiedField {
  fieldName: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface IModificationLogEntry {
  _id: string;
  date: string;
  agentId: string;
  modifiedFields: IModifiedField[];
}
