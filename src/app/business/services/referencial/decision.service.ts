import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {Decision} from "../../models/referencial/decision";
import {HttpClient} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";

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
}
