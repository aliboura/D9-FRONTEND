import {AuditSite} from "./audit-site";
import {AuditSiteLine} from "./audit-site-line";

export class AuditSecondVisit {
  auditSite: AuditSite;
  auditSiteLines: AuditSiteLine[];


  constructor(auditSite: AuditSite, auditSiteLines: AuditSiteLine[]) {
    this.auditSite = auditSite;
    this.auditSiteLines = auditSiteLines;
  }
}
