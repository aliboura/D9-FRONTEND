export class AuditSiteLine {

  id: number;
  label: string;
  auditSiteId: number;
  subCategoriesId: number;
  categoriesId: number;
  observation: string;
  firstDecisionId: number;
  firstDecisionLabel: string;
  secondDecisionId: number;
  secondDecisionLabel: string;


  constructor(auditSiteId: number, label: string, subCategoriesId: number, categoriesId: number, observation: string) {
    this.auditSiteId = auditSiteId;
    this.label = label;
    this.subCategoriesId = subCategoriesId;
    this.categoriesId = categoriesId;
    this.observation = observation;
  }
}
