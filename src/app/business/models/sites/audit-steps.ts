import {AuditSite} from "./audit-site";
import {AuditSiteLine} from "./audit-site-line";

export class AuditSteps {
  auditSite: AuditSite;
  auditSiteLineList: AuditSiteLine[] = [];
  editCategories: boolean;

  constructor(auditSite: AuditSite, auditSiteLineList: AuditSiteLine[], editCategories: boolean) {
    this.auditSite = auditSite;
    this.auditSiteLineList = auditSiteLineList;
    this.editCategories = editCategories;
  }
}
