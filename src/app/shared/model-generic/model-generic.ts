import { Parents } from "./parents";
import { TypeInput } from "../enum/type-input.enum";
// options: { [key: string]: T[] };

export class ModelGeneric<T extends Parents> {
  field: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  readOnly: boolean;
  rendred: boolean;
  multiple: boolean;

  options: T[];
  message: string;

  constructor(
    field?: string,
    label?: string,
    type?: string,
    placeholder?: string,
    required?: boolean,
    readOnly?: boolean,
    rendred?: boolean,
    multiple?: boolean,
    options?: T[],
    message?: string
  ) {
    this.field = field || "";
    this.label = label || "";
    this.type = type || TypeInput.Input;
    this.placeholder = placeholder || "";
    this.required = required || false;
    this.readOnly = readOnly || false;
    this.rendred = rendred || true;
    this.multiple = multiple || false;
    this.options = options || null;
    this.message = message || "";
  }
}
