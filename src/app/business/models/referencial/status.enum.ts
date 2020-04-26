import {id} from "@swimlane/ngx-charts";

export enum StatusEnum {
  NA = "N/A",
  InProgress = "En Cours",
  InProgressValidate = "En cours de validation V1",
  InProgressValidateV2 = "En cours de validation V2",
  Conform = "Conforme",
  NoConform = "Non Conforme",
  ValidateBySiteEngineer = "Valider ingénieur site",
  ValidateByOMEngineer = "Valider ingénieur OM",
  Accepted = "Accepter avec réserve"
}
