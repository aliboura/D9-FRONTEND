import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {AuditSiteLine} from "../../models/sites/audit-site-line";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {AuditSite} from "../../models/sites/audit-site";
import {Observable} from "rxjs";
import {STATIC_DATA} from "../../../tools/static-data";
import {AuditSteps} from "../../models/sites/audit-steps";

@Injectable({
  providedIn: 'root'
})
export class AuditSiteLineService extends GenericService<AuditSiteLine> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/audit_lines";
  }

  goToNextSteps(auditSteps: AuditSteps): Observable<AuditSite> {
    return this.getHttp().put<AuditSite>(this.getApi() + "/goToNext", auditSteps, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(STATIC_DATA.TOKEN)
      })
    });
  }


}
