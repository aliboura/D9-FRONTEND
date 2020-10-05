import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {AuditSiteLine} from "../../models/sites/audit-site-line";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {AuditSite} from "../../models/sites/audit-site";
import {Observable} from "rxjs";
import {STATIC_DATA} from "../../../tools/static-data";
import {AuditSteps} from "../../models/sites/audit-steps";
import {ResponseMessage} from "../../models/admin/response-message";
import {FileResponse} from "../../models/sites/file-response";

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
    return this.getHttp().put<AuditSite>(this.getApi() + "/goToNext", auditSteps);
  }

  uploadFile(file: File) {
    const formData: FormData = new FormData();

    formData.append('file', file);
    return this.getHttp().post<ResponseMessage>(API_URLs.APPS_URL + `/uploads`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
  }

  saveFiles(auditSite: AuditSite) {
    return this.getHttp().post<AuditSite>(API_URLs.APPS_URL + `/audit_lines/saveFiles`, auditSite, {
      reportProgress: true,
      responseType: 'json'
    });
  }

  downloadTemplates() {
    return this.getHttp().get<FileResponse>(API_URLs.APPS_URL + `/uploads/templates`);
  }


}
