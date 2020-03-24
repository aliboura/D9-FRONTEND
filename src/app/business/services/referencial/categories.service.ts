import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {Categories} from "../../models/referencial/categories";
import {HttpClient} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {Observable} from "rxjs";

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
}
