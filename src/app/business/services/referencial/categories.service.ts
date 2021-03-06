import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {Categories} from "../../models/referencial/categories";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {Observable} from "rxjs";
import {STATIC_DATA} from "../../../tools/static-data";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends GenericService<Categories> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/categories";
  }

  getFirst(): Observable<Categories> {
    return this.getHttp().get<Categories>(this.getApi() + "/first");
  }

  getFirstByType(type: number): Observable<Categories> {
    return this.getHttp().get<Categories>(this.getApi() + "/first", {
      params: new HttpParams()
        .set("type", "" + type)
    });
  }

  findAllActive(): Observable<Categories[]> {
    return this.getHttp().get<Categories[]>(this.getApi() + "/active");
  }

  findAllOnlyFirst(): Observable<Categories[]> {
    return this.getHttp().get<Categories[]>(this.getApi() + "/noFirst");
  }

  findAllOnlyLast(): Observable<Categories[]> {
    return this.getHttp().get<Categories[]>(this.getApi() + "/noLast");
  }
}
