import {Pages} from "./../model-generic/pages";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {STATIC_DATA} from "../../tools/static-data";

@Injectable()
export abstract class GenericService<T> {
  abstract getApi(): string;

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<Array<T>> {
    return this.http.get<Array<T>>(this.getApi(), {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(STATIC_DATA.TOKEN)
      })
    });
  }

  findLazyData(
    page: number,
    size: number,
    sort: string,
    field: string
  ): Observable<Pages<T>> {
    const header = new HttpHeaders({
      Authorization: localStorage.getItem(STATIC_DATA.TOKEN)
    });
    return this.http.get<Pages<T>>(this.getApi(), {
      headers: header,
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
    });
  }

  searchLazyData(
    page: number,
    size: number,
    sort: string,
    field: string,
    search: string
  ): Observable<Pages<T>> {
    const header = new HttpHeaders({
      Authorization: localStorage.getItem(STATIC_DATA.TOKEN)
    });
    return this.http.get<Pages<T>>(this.getApi() + "/search_adv", {
      headers: header,
      params: new HttpParams()
        .set("page", "" + page)
        .set("size", "" + size)
        .set("sort", sort)
        .set("field", field)
        .set("search", search)
    });
  }

  findPagination(page: number, size: number): Observable<Pages<T>> {
    return this.http.get<Pages<T>>(this.getApi(), {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(STATIC_DATA.TOKEN)
      }),
      params: new HttpParams().set("page", "" + page).set("size", "" + size)
    });
  }

  create(data: NgForm): Observable<T> {
    return this.http.post<T>(this.getApi(), data, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(STATIC_DATA.TOKEN)
      })
    });
  }

  createAll(datas: Array<T>): Observable<T> {
    return this.http.post<T>(this.getApi() + "/all", datas, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(STATIC_DATA.TOKEN)
      })
    });
  }

  update(data: NgForm): Observable<T> {
    return this.http.put<T>(this.getApi(), data, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(STATIC_DATA.TOKEN)
      })
    });
  }

  delete(id: string) {
    return this.http.delete<T>(this.getApi() + "/" + id, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(STATIC_DATA.TOKEN)
      })
    });
  }

  findById(id: string): Observable<T> {
    return this.http.get<T>(this.getApi(), {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem(STATIC_DATA.TOKEN)
      }),
      params: new HttpParams().set("id", id)
    });
  }
}
