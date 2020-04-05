import {SubCategories} from "../referencial/sub-categories";

export class AuditSiteLine {

  id: number;
  label: string;
  auditSiteId: number;
  subCategoriesId: number;
  subCategoriesValueType: number;
  blocking: boolean;
  categoriesId: number;
  categoriesLabel: string;
  observation: string;
  firstDecisionId: number;
  firstDecisionLabel: string;
  secondDecisionId: number;
  secondDecisionLabel: string;
  subCategories: SubCategories;


  constructor(auditSiteId?: number,
              label?: string,
              subCategoriesId?: number,
              subCategories?: SubCategories,
              categoriesId?: number,
              observation?: string) {
    this.auditSiteId = auditSiteId || null;
    this.label = label || "";
    this.subCategoriesId = subCategoriesId || null;
    this.subCategories = subCategories || null;
    this.categoriesId = categoriesId || null;
    this.observation = observation || null;
  }
}
