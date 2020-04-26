import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {SiteForms} from "../../models/sites/site-forms";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {Observable} from "rxjs";
import {STATIC_DATA} from "../../../tools/static-data";

@Injectable({
  providedIn: 'root'
})
export class SiteFormsService extends GenericService<SiteForms> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/sites_forms";
  }

  findByCodeSite(codeSite: string): Observable<SiteForms[]> {
    return this.getHttp().get<SiteForms[]>(this.getApi(), {
      params: new HttpParams().set("codeSite", codeSite)
    });
  }

}
