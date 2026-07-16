import type { MasterModuleKey } from "./constants";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "time"
  | "select"
  | "relation"
  | "boolean";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: SelectOption[];
  /** When type is "relation", the module whose rows populate this field. */
  relation?: MasterModuleKey;
  /** Relation cardinality. Defaults to single (one id). */
  multiple?: boolean;
  placeholder?: string;
  help?: string;
  min?: number;
  max?: number;
}

export type ColumnRender = "text" | "badge" | "date" | "status" | "relation" | "number";

export interface ColumnConfig {
  key: string;
  label: string;
  render?: ColumnRender;
  sortable?: boolean;
  /** Hideable columns can be toggled via the column menu. Defaults to true. */
  hideable?: boolean;
}

export interface MasterModuleConfig {
  key: MasterModuleKey;
  title: string;
  singular: string;
  description: string;
  /** Field whose value drives the status filter + status badge. */
  statusField?: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
}

/** Raw row returned from the repository (dates are Date objects). */
export type MasterRow = Record<string, unknown>;

/** Values produced by the form (dates as ISO strings, relations as id arrays). */
export type MasterFormValues = Record<string, string | number | boolean | string[]>;
