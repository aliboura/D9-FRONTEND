export class AuditSiteLine {

  id: number;
  label: string;
  auditSiteId: number;
  subCategoriesId: number;
  categoriesId: number;
  categoriesLabel: string;
  observation: string;
  firstDecisionId: number;
  firstDecisionLabel: string;
  secondDecisionId: number;
  secondDecisionLabel: string;


  constructor(auditSiteId?: number, label?: string, subCategoriesId?: number, categoriesId?: number, observation?: string) {
    this.auditSiteId = auditSiteId || null;
    this.label = label || "";
    this.subCategoriesId = subCategoriesId || null;
    this.categoriesId = categoriesId || null;
    this.observation = observation || null;
  }
}
