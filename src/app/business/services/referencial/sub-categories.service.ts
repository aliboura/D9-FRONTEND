import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {SubCategories} from "../../models/referencial/sub-categories";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SubCategoriesService extends GenericService<SubCategories> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return "";
  }
}
