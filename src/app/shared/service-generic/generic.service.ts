import {Pages} from "./../model-generic/pages";
import {HttpClient, HttpParams} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export abstract class GenericService<T> {
  abstract getApi(): string;

  protected constructor(private http: HttpClient) {
  }

  getHttp(): HttpClient {
    return this.http;
  }

  findAll(): Observable<Array<T>> {
    return this.http.get<Array<T>>(this.getApi());
  }

  findLazyData(
    page: number,
    size: number,
    sort: string,
    field: string
  ): Observable<Pages<T>> {
    return this.http.get<Pages<T>>(this.getApi(), {
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
    return this.http.get<Pages<T>>(this.getApi(), {
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
      params: new HttpParams().set("page", "" + page).set("size", "" + size)
    });
  }

  findSort(sort: string, field: string): Observable<T[]> {
    return this.http.get<T[]>(this.getApi(), {
      params: new HttpParams().set("sort", "" + sort).set("field", "" + field)
    });
  }

  create(data: NgForm): Observable<T> {
    return this.http.post<T>(this.getApi(), data);
  }

  createModel(data: T): Observable<T> {
    return this.http.post<T>(this.getApi(), data);
  }

  createAll(datas: Array<T>): Observable<T> {
    return this.http.post<T>(this.getApi() + "/all", datas);
  }

  update(data: NgForm): Observable<T> {
    return this.http.put<T>(this.getApi(), data);
  }

  updateModel(data: T): Observable<T> {
    return this.http.put<T>(this.getApi(), data);
  }

  delete(id: string) {
    return this.http.delete<T>(this.getApi() + "/" + id);
  }

  findById(id: string): Observable<T> {
    return this.http.get<T>(this.getApi(), {
      params: new HttpParams().set("id", id)
    });
  }
}
