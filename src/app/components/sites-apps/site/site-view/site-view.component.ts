import {Component, OnInit} from '@angular/core';
import {Site} from "../../../../business/models/sites/site";
import {Observable} from "rxjs";
import {SiteService} from "../../../../business/services/sites/site.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {VisitPlanningService} from "../../../../business/services/sites/visit-planning.service";
import {VisitPlanning} from "../../../../business/models/sites/visit-planning";
import {UtilsService} from "../../../../tools/utils.service";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";

@Component({
  selector: 'app-site-view',
  templateUrl: './site-view.component.html'
})
export class SiteViewComponent implements OnInit {

  constructor(private siteService: SiteService,
              private route: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              private utilsService: UtilsService,
              private jwtTokenService: JwtTokenService,
              private visitPlanningService: VisitPlanningService) {
  }

  id: string;
  site: Site = new Site();
  private obSite: Observable<Site>;
  planning: VisitPlanning;

  ngOnInit() {
    this.obSite = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.siteService.findById(atob(params.get("id")))
      )
    );
    this.obSite.subscribe(data => {
      this.site = data;
      this.id = this.site.codeSite;
      this.getVisitPlanning("" + this.site.id);
    });
  }

  public showList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }


  public getVisitPlanning(id: string) {
    this.visitPlanningService.findBySiteId(id).subscribe(data => {
      this.planning = data;
    });
  }

  getDateFormat(myDate: Date): string {
    return this.datePipe.transform(myDate, 'dd-MM-yyyy h:mm a');
  }

  disabledUploadBtn(): boolean {
    if (this.utilsService.equalsWithIgnoreCase(this.site.userV1, this.jwtTokenService.getUserName())) {
      return false;
    }

    if (this.utilsService.equalsWithIgnoreCase(this.site.userV1, this.jwtTokenService.getUserName())) {
      return false;
    }
    return true;
  }

  goToForms() {
    this.router.navigate(['forms', btoa("" + this.site.id)], {relativeTo: this.route.parent});
  }

}
