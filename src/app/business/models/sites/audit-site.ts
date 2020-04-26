import {AuditSiteLine} from "./audit-site-line";
import {Categories} from "../referencial/categories";
import {StatusAuditSite} from "./status-audit-site";
import {StatusEnum} from "../referencial/status.enum";

export class AuditSite {
  id: number;
  auditDate: Date;
  userId: string;
  siteCode: string;
  typeAuditSiteId: number;
  typeAuditSiteLabel: string;
  wilayaId: number;
  regionId: string;
  repOwner: string;
  description: string;
  observation: string;
  firstCheckDate: Date;
  secondCheck: boolean | false;
  secondCheckDate: Date;

  currentCategoriesId: number;
  currentCategoriesLabel: string;

  currentSatusId: number;
  currentSatusLabel: string;
  currentSatusDescription: string;
  currentSatusStyleCSS: string;
  currentSatusIconCSS: string;

  lastStep: boolean;
  firstVisit: boolean;
  closed: boolean;

  firstDecisionId: number;
  firstDecisionLabel: string;
  firstDecisionDate: Date;
  firstDecisionEngineerSite: string;
  firstDecisionEngineerOM: string;

  secondVisit: boolean;
  secondDecisionId: number;
  secondDecisionLabel: string;
  secondDecisionDate: Date;
  secondDecisionEngineerSite: string;
  secondDecisionEngineerOM: string;

  auditSiteLineDtoList: AuditSiteLine[];
  statusAuditSitesDtoList: StatusAuditSite[];

}
