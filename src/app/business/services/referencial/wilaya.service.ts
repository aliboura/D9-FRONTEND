import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {Wilaya} from "../../models/referencial/wilaya";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {Observable} from "rxjs";
import {STATIC_DATA} from "../../../tools/static-data";

@Injectable({
  providedIn: 'root'
})
export class WilayaService extends GenericService<Wilaya> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/wilayas";
  }

  findByRegion(regionId: string): Observable<Wilaya[]> {
    const header = new HttpHeaders({
      Authorization: localStorage.getItem(STATIC_DATA.TOKEN)
    });
    return this.getHttp().get<Wilaya[]>(this.getApi() + "/by_region", {
      headers: header,
      params: new HttpParams()
        .set("regionId", "" + regionId)
    });
  }
}
