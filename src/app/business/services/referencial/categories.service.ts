import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {Categories} from "../../models/referencial/categories";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends GenericService<Categories> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return "";
  }
}
