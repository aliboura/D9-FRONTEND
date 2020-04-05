import { Injectable } from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {TypeAuditSite} from "../../models/sites/type-audit-site";
import {HttpClient} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";

@Injectable({
  providedIn: 'root'
})
export class TypeAuditSiteService extends GenericService<TypeAuditSite> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/type_audit_sites";
  }
}
