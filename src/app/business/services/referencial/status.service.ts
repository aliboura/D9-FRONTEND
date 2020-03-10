import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {Status} from "../../models/referencial/status";
import {HttpClient} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";

@Injectable({
  providedIn: 'root'
})
export class StatusService extends GenericService<Status> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/status";
  }
}
