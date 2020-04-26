import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../../business/services/admin/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {User} from "../../../../business/models/admin/user";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {AdUserService} from "../../../../business/services/admin/ad-user.service";
import {AdUser} from "../../../../business/models/admin/ad-user";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              public userService: AdUserService,
              private screenSpinnerService: ScreenSpinnerService) {
  }

  object = "users";

  datasource: MatTableDataSource<AdUser>;
  displayedColumns: string[] = ["id", "username", "firstName", "lastName", "email", "enabled", "action"];
  columnsFilter: string[] = ["username", "firstName", "lastName"];

  emptyData: boolean;
  resultsLength = 0;
  pagesLength = 10;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.loadAllData();
  }

  private loadAllData() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.userService.findLazyData(
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
        this.datasource = new MatTableDataSource<AdUser>(data);
        this.emptyData = data.length === 0;
        this.datasource.sort = this.sort;
        this.screenSpinnerService.hide(200);
      });
  }

  public goToEdit(username: string) {
    this.router.navigate([btoa(username)], {relativeTo: this.route});
  }
}
