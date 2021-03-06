import {Parents} from "./parents";
import {TypeInput} from "../enum/type-input.enum";
import {Observable} from "rxjs";

// options: { [key: string]: T[] };

export class ModelGeneric<T> {
  field: string;
  type: string;
  required: boolean;
  readOnly: boolean;
  rendred: boolean;
  multiple: boolean;

  options: T[];
  message: string;
  optionsObs: Observable<T[]>;

  constructor(
    field?: string,
    type?: string,
    required?: boolean,
    readOnly?: boolean,
    rendred?: boolean,
    multiple?: boolean,
    options?: T[],
    message?: string,
    optionsObs?: Observable<T[]>
  ) {
    this.field = field || "";
    this.type = type || TypeInput.Input;
    this.required = required || false;
    this.readOnly = readOnly || false;
    this.rendred = rendred || true;
    this.multiple = multiple || false;
    this.options = options || null;
    this.message = message || "";
    this.optionsObs = optionsObs || null;
  }
}
