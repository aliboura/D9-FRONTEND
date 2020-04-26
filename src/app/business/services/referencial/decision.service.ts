import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {Decision} from "../../models/referencial/decision";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {STATIC_DATA} from "../../../tools/static-data";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DecisionService extends GenericService<Decision> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/decisions";
  }

  public findByTypeValue(type: number): Observable<Decision[]> {
    return this.getHttp().get<Decision[]>(this.getApi(), {
      params: new HttpParams().set("type", "" + type)
    });
  }

  public findByLabelAndPosition(label: string, position: number): Observable<Decision> {
    return this.getHttp().get<Decision>(this.getApi(), {
      params: new HttpParams().set("label", label)
        .set("position", "" + position)
    });
  }
}
