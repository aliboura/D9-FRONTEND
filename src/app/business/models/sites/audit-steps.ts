import {AuditSite} from "./audit-site";
import {AuditSiteLine} from "./audit-site-line";
import {Categories} from "../referencial/categories";

export class AuditSteps {
  auditSite: AuditSite;
  currentCategory: Categories;
  auditSiteLineList: AuditSiteLine[] = [];
  editCategories: boolean;

  constructor(auditSite?: AuditSite, currentCategory?: Categories, auditSiteLineList?: AuditSiteLine[], editCategories?: boolean) {
    this.auditSite = auditSite || null;
    this.currentCategory = currentCategory || null;
    this.auditSiteLineList = auditSiteLineList || null;
    this.editCategories = editCategories || false;
  }
}
