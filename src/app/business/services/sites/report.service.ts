import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {Reports} from "../../models/sites/reports";
import {DatePipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient,
              private datePipe: DatePipe) {
  }

  private getApi() {
    return API_URLs.APPS_URL + '/export';
  }


  exportToPdf(report: Reports, sort: string, field: string, search: string) {
    return this.http.post(this.getApi() + "/toPDf", report, {
      responseType: 'blob',
      params: new HttpParams()
        .set("sort", sort)
        .set("field", field)
        .set("search", search)
    });
  }

  exportToExcel(report: Reports, sort: string, field: string, search: string) {
    return this.http.post(this.getApi() + "/toExcel", report, {
      responseType: 'blob',
      params: new HttpParams()
        .set("sort", sort)
        .set("field", field)
        .set("search", search)
    });
  }

}
