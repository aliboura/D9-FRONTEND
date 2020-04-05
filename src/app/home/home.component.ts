import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../business/services/apps/screen-spinner.service";
import {SiteService} from "../business/services/sites/site.service";
import {AuditSiteService} from "../business/services/sites/audit-site.service";
import {StatusEnum} from "../business/models/referencial/status.enum";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(private siteService: SiteService,
              private auditSiteService: AuditSiteService,
              private spinner: NgxSpinnerService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.screenSpinnerService.show();
    this.spinner.show();
  }

  dataSitePie: any[];
  dataConformedPie: any[];
  dataSiteBar: any[];
  siteRegionBars: any[];
  siteVisitPie: any[];
  view: number[] = [600, 350];
  view2: number[] = [800, 450];
  view3: number[] = [300, 150];
  colorScheme = {
    domain: ['#FD4047', '#ffbabc', '#666666', '#c9c1c1', '#8796C0', '#8796C0', '#CC33FF', '#1D68FB', '#A8385D']
  };

  ngOnInit() {
    this.siteService.findAll().subscribe(data => {
      const noAuditeds = data.filter(x => !x.audited);
      const regionAs = data.filter(x => x.regionId === "A");
      const regionCs = data.filter(x => x.regionId === "C");
      this.dataSitePie = this.loadSitePie(data.length, noAuditeds.length);
      this.siteRegionBars = this.loadSiteByRegionID(data.length, regionAs.length, regionCs.length);
      this.dataSiteBar = this.loadAuditedSiteBar(data.length, noAuditeds.length);
      Object.assign(this, this.siteRegionBars);
      Object.assign(this, this.dataSitePie);
      Object.assign(this, this.dataSiteBar);
    });

    this.auditSiteService.findAll().subscribe(data => {
      const conforms = data.filter(x => x.currentSatusLabel === StatusEnum.Conform);
      const nonConforms = data.filter(x => x.currentSatusLabel === StatusEnum.NoConform);
      const accepted = data.filter(x => x.currentSatusLabel === StatusEnum.Accepted);
      const inProgress = data.filter(x => x.currentSatusLabel === StatusEnum.InProgress);
      const enCours = data.filter(x => !x.firstVisit);
      const firstVisits = data.filter(x => x.firstVisit && !x.secondVisit);
      const secondVisits = data.filter(x => x.secondVisit);
      this.dataConformedPie = this.loadConformedPie(inProgress.length, conforms.length, nonConforms.length, accepted.length);
      this.siteVisitPie = this.loadSiteVisitPie(enCours.length, firstVisits.length, secondVisits.length);
      Object.assign(this, this.siteVisitPie);
      Object.assign(this, this.dataConformedPie);
    });

    setTimeout(() => {
      this.spinner.hide();
      this.screenSpinnerService.hide();
    }, 200);
  }


  private loadSiteVisitPie(enCours: number, firstVisit: number, scondVisit: number): any[] {
    return [
      {
        "name": "En Cours",
        "value": enCours
      },
      {
        "name": "Première visite",
        "value": firstVisit
      },
      {
        "name": "Deuxième visite",
        "value": scondVisit
      }
    ];
  }

  private loadConformedPie(progress: number, conform: number, nonConform: number, accepted: number): any[] {
    return [
      {
        "name": "En cours",
        "value": progress
      },
      {
        "name": "Conforme",
        "value": conform
      },
      {
        "name": "Non Conforme",
        "value": nonConform
      },
      {
        "name": "Accepté avec Réserve",
        "value": accepted
      }
    ];
  }

  private loadSitePie(size: number, noAuditSize: number): any[] {
    return [
      {
        "name": "Conforme",
        "value": size - noAuditSize
      },
      {
        "name": "Non Conforme",
        "value": noAuditSize
      }
    ];
  }

  private loadAuditedSiteBar(size: number, noAuditSize: number): any[] {
    return [
      {
        "name": "Audité",
        "value": size - noAuditSize
      },
      {
        "name": "Non Audité",
        "value": noAuditSize
      }
    ];
  }

  private loadSiteByRegionID(size: number, aSize: number, cSize: number): any[] {
    return [
      {
        "name": "Alger",
        "value": aSize
      },
      {
        "name": "Constantine",
        "value": cSize
      },
      {
        "name": "Oran",
        "value": size - (aSize + cSize)
      }
    ];
  }

}
