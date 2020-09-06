import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {Site} from "../../models/sites/site";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {Observable} from "rxjs";
import {Pages} from "../../../shared/model-generic/pages";

@Injectable({
  providedIn: 'root'
})
export class SiteService extends GenericService<Site> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/sites";
  }

  findSites(page: number, size: number, sort: string, field: string, codeSite: string, userV1: string): Observable<Pages<Site>> {
    return this.getHttp().get<Pages<Site>>(this.getApi(), {
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
        .set("codeSite", codeSite)
        .set("username", userV1)
    });
  }


  findByLikeCodeSite(page: number, size: number, sort: string, field: string, codeSite: string, cities: string): Observable<Pages<Site>> {
    return this.getHttp().get<Pages<Site>>(this.getApi(), {
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
        .set("audited", field)
        .set("codeSite", codeSite)
        .set("cities", cities)
    });
  }

  findSitesWilayas(page: number, size: number, sort: string, field: string, codeSite: string, wilayas: string, userV1: string): Observable<Pages<Site>> {
    return this.getHttp().get<Pages<Site>>(this.getApi(), {
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
        .set("codeSite", codeSite)
        .set("wilayas", wilayas)
        .set("username", userV1)
    });
  }

  findSitesByUserWilayas(page: number, size: number, sort: string, field: string, userV1: string): Observable<Pages<Site>> {
    return this.getHttp().get<Pages<Site>>(this.getApi(), {
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
        .set("user", userV1)
    });
  }
}
