import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {WilayaRegion} from "../../models/referencial/wilaya-region";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {Observable} from "rxjs";
import {Wilaya} from "../../models/referencial/wilaya";

@Injectable({
  providedIn: 'root'
})
export class WilayaRegionService extends GenericService<WilayaRegion> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/wilaya_regions";
  }

  findByRegion(regionId: string): Observable<WilayaRegion[]> {
    return this.getHttp().get<WilayaRegion[]>(this.getApi(), {
      params: new HttpParams()
        .set("regionId", regionId)
    });
  }
}
