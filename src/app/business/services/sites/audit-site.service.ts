import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {AuditSite} from "../../models/sites/audit-site";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {STATIC_DATA} from "../../../tools/static-data";
import {AuditSteps} from "../../models/sites/audit-steps";
import {Observable} from "rxjs";
import {Pages} from "../../../shared/model-generic/pages";
import {Site} from "../../models/sites/site";

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

  exportToPdf(id: number) {
    return this.getHttp().get(this.getApi() + "/toPdf", {
      responseType: 'blob',
      params: new HttpParams().set("id", "" + id)
    });
  }

  exportAuditToPdf() {
    return this.getHttp().get(this.getApi() + "/AuditsEnCours", {
      responseType: 'blob'
    });
  }

  exportToExcel(id: number) {
    return this.getHttp().get(this.getApi() + "/toExcel", {
      responseType: 'blob',
      params: new HttpParams().set("id", "" + id)
    });
  }

  findByEngineerSite(page: number,
                     size: number,
                     sort: string,
                     field: string,
                     engineer: string): Observable<Pages<AuditSite>> {
    return this.getHttp().get<Pages<AuditSite>>(this.getApi(), {
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
        .set("engineer", engineer)
    });
  }
}
