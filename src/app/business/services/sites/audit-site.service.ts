import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {AuditSite} from "../../models/sites/audit-site";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {STATIC_DATA} from "../../../tools/static-data";
import {AuditSteps} from "../../models/sites/audit-steps";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuditSiteService extends GenericService<AuditSite> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/audit_sites";
  }

  saveSecondVisit(auditSite: AuditSite) {
    return this.getHttp().put<AuditSite>(this.getApi() + "/second-visit", auditSite);
  }

  goToFinish(auditSteps: AuditSteps): Observable<AuditSite> {
    return this.getHttp().put<AuditSite>(this.getApi() + "/goToFinish", auditSteps);
  }
}
