import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {DecisionType} from "../../models/referencial/decision-type";
import {API_URLs} from "../../../tools/api-url";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {STATIC_DATA} from "../../../tools/static-data";

@Injectable({
  providedIn: 'root'
})
export class DecisionTypeService extends GenericService<DecisionType> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/decision_types";
  }

}
