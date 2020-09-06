import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {VisitPlanning} from "../../models/sites/visit-planning";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {Observable} from "rxjs";
import {Pages} from "../../../shared/model-generic/pages";

@Injectable({
  providedIn: 'root'
})
export class VisitPlanningService extends GenericService<VisitPlanning> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/visits";
  }

  findBySiteId(id: string): Observable<VisitPlanning> {
    return this.getHttp().get<VisitPlanning>(this.getApi(), {
      params: new HttpParams()
        .set("site", id)
    });
  }

  existSite(id: string): Observable<boolean> {
    return this.getHttp().get<boolean>(this.getApi() + '/exist', {
      params: new HttpParams()
        .set("site", id)
    });
  }

  findByCities(page: number, size: number, sort: string, field: string, cities: string): Observable<Pages<VisitPlanning>> {
    return this.getHttp().get<Pages<VisitPlanning>>(this.getApi(), {
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
        .set("cities", cities)
    });
  }

  findByCode(page: number, size: number, sort: string, field: string, code: string, cities: string): Observable<Pages<VisitPlanning>> {
    return this.getHttp().get<Pages<VisitPlanning>>(this.getApi(), {
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
        .set("code", code)
        .set("cities", cities)
    });
  }

  findFirstVisitPlannings(page: number, size: number, sort: string, field: string, engineerSiteV1: string, fromDate: string, toDate: string, cities: string): Observable<Pages<VisitPlanning>> {
    return this.getHttp().get<Pages<VisitPlanning>>(this.getApi(), {
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
        .set("engineerSiteV1", engineerSiteV1)
        .set("fromDate", fromDate)
        .set("toDate", toDate)
        .set("cities", cities)
    });
  }

  findSecondVisitPlannings(page: number, size: number, sort: string, field: string, engineerSiteV2: string, fromDate: string, toDate: string, cities: string): Observable<Pages<VisitPlanning>> {
    return this.getHttp().get<Pages<VisitPlanning>>(this.getApi(), {
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
        .set("engineerSiteV2", engineerSiteV2)
        .set("fromDate", fromDate)
        .set("toDate", toDate)
        .set("cities", cities)
    });
  }


  myPlannings(page: number, size: number, sort: string, field: string, username: string): Observable<Pages<VisitPlanning>> {
    return this.getHttp().get<Pages<VisitPlanning>>(this.getApi(), {
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
        .set("username", username)
    });
  }

  notificationCount(username: string): Observable<number> {
    return this.getHttp().get<number>(this.getApi() + "/count", {
      params: new HttpParams()
        .set("username", username)
    });
  }

}
