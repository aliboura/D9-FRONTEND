import {Component, OnInit} from '@angular/core';
import {Site} from "../../../../business/models/sites/site";
import {Observable} from "rxjs";
import {SiteService} from "../../../../business/services/sites/site.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-site-view',
  templateUrl: './site-view.component.html'
})
export class SiteViewComponent implements OnInit {

  constructor(private siteService: SiteService,
              private route: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe) {
  }

  id: string;
  site: Site = new Site();
  private obSite: Observable<Site>;

  ngOnInit() {
    this.obSite = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.siteService.findById(atob(params.get("id")))
      )
    );
    this.obSite.subscribe(data => {
      this.site = data;
      this.id = this.site.codeSite;
    });
  }


  public showList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  getDateFormat(myDate: Date): string {
    return this.datePipe.transform(myDate, 'dd-MM-yyyy h:mm a');
  }


}
