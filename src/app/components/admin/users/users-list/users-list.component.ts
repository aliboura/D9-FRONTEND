import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {UserService} from "../../../../business/services/admin/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {User} from "../../../../business/models/admin/user";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppRole} from "../../../../business/models/admin/app-role";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements AfterViewInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              public userService: UserService,
              private screenSpinnerService: ScreenSpinnerService) {
  }

  object = "users";

  datasource: MatTableDataSource<User>;
  displayedColumns: string[] = ["id", "matricule", "username", "fullName", "phone", "roles", "enabled", "action"];

  emptyData: boolean;
  resultsLength = 0;
  pagesLength = 10;
  isLoadingResults = true;
  isRateLimitReached = false;
  query: string;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.loadAllData();
  }

  private loadAllData(search?: string) {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          return search ?
            this.userService.searchLazyData(
              this.paginator.pageIndex,
              this.paginator.pageSize,
              "asc",
              "id",
              search
            ) :
            this.userService.findLazyData(
              this.paginator.pageIndex,
              this.paginator.pageSize,
              "asc",
              "id"
            );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalElements;
          this.pagesLength = this.paginator.pageSize;
          return data.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.datasource = new MatTableDataSource<User>(data);
        this.emptyData = data.length === 0;
        this.datasource.sort = this.sort;
        this.screenSpinnerService.hide(200);
      });
  }

  public goToEdit(username: string) {
    this.router.navigate([btoa(username)], {relativeTo: this.route});
  }

  public goToSite(username: string) {
    this.router.navigate(['site', btoa(username)], {relativeTo: this.route});
  }

  public getRoles(roleSet: AppRole[]) {
    return roleSet.map(x => x.label).toString();
  }

  showAdd() {
    this.router.navigate(['add'], {relativeTo: this.route});
    this.screenSpinnerService.show();
  }

  applyFilter() {
    this.screenSpinnerService.show();
    this.loadAllData(`username==*${this.query.trim().toLowerCase()}*,phone==*${this.query.trim().toLowerCase()}*,fullName==*${this.query.trim().toLowerCase()}*,matricule==*${this.query.trim().toLowerCase()}*`);
  }

  resetFilter() {
    this.screenSpinnerService.show();
    this.query = null;
    this.loadAllData();
  }

}
