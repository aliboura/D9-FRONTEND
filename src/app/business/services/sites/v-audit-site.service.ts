import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {VAuditSites} from "../../models/sites/v-audit-sites";
import {HttpClient} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";

@Injectable({
  providedIn: 'root'
})
export class VAuditSiteService extends GenericService<VAuditSites> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return `${API_URLs.APPS_URL}/v_audit_sites`;
  }
}
