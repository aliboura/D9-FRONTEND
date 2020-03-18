import {AuditSiteLine} from "./audit-site-line";

export class AuditSite {
  id: number;
  auditDate: Date;
  userId: string;
  siteCode: string;
  wilayaId: number;
  regionId: string;
  repOwner: string;
  description: string;
  observation: string;
  currentCategoriesId: number;
  currentCategoriesLabel: string;
  currentSatusId: number;
  currentSatusLabel: string;
  firstDecisionId: number;
  firstDecisionLabel: string;
  firstDecisionDate: Date;
  firstDecisionEngineerSite: string;
  firstDecisionEngineerOM: string;
  secondDecisionId: number;
  secondDecisionLabel: string;
  secondDecisionDate: Date;
  secondDecisionEngineerSite: string;
  secondDecisionEngineerOM: string;

  auditSiteLineDtoList: AuditSiteLine[];
}
