import {SubCategories} from "../referencial/sub-categories";
import {Decision} from "../referencial/decision";

export class AuditSiteLine {

  id: number;
  label: string;
  auditSiteId: number;
  subCategoriesId: number;
  valueType: number;
  blocking: boolean;
  categoriesId: number;
  categoriesLabel: string;
  observation: string;
  firstDecisionId: number;
  firstDecisionLabel: string;
  secondDecisionId: number;
  secondDecisionLabel: string;


  constructor(auditSiteId?: number,
              label?: string,
              subCategoriesId?: number,
              blocking?: boolean,
              valueType?: number,
              categoriesId?: number,
              observation?: string) {
    this.auditSiteId = auditSiteId || null;
    this.label = label || "";
    this.subCategoriesId = subCategoriesId || null;
    this.blocking = blocking || false;
    this.valueType = valueType || null;
    this.categoriesId = categoriesId || null;
    this.observation = observation || null;
  }
}
