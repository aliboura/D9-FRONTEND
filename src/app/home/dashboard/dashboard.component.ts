import {Component, OnInit} from '@angular/core';
import {SiteService} from "../../business/services/sites/site.service";
import {AuditSiteService} from "../../business/services/sites/audit-site.service";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";
import {StatusEnum} from "../../business/models/referencial/status.enum";
import {VAuditSiteService} from "../../business/services/sites/v-audit-site.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor(private siteService: SiteService,
              private vAuditSiteService: VAuditSiteService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.screenSpinnerService.hide(200);
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

    this.vAuditSiteService.findAll().subscribe(data => {
      const noAuditeds = data.filter(x => !x.audited);
      const regionAs = data.filter(x => x.region === "A");
      const regionCs = data.filter(x => x.region === "C");
      this.dataSitePie = this.loadSitePie(data.length, noAuditeds.length);
      this.siteRegionBars = this.loadSiteByRegionID(data.length, regionAs.length, regionCs.length);
      this.dataSiteBar = this.loadAuditedSiteBar(data.length, noAuditeds.length);
      Object.assign(this, this.siteRegionBars);
      Object.assign(this, this.dataSitePie);
      Object.assign(this, this.dataSiteBar);
      const conforms = data.filter(x => x.status === StatusEnum.Conform);
      const nonConforms = data.filter(x => x.status === StatusEnum.NoConform);
      const accepted = data.filter(x => x.status === StatusEnum.Accepted);
      const inProgress = data.filter(x => x.status === StatusEnum.InProgress);
      const enCours = data.filter(x => !x.firstVisit);
      const firstVisits = data.filter(x => x.firstVisit && !x.secondVisit);
      const secondVisits = data.filter(x => x.secondVisit);
      this.dataConformedPie = this.loadConformedPie(inProgress.length, conforms.length, nonConforms.length, accepted.length);
      this.siteVisitPie = this.loadSiteVisitPie(enCours.length, firstVisits.length, secondVisits.length);
      Object.assign(this, this.siteVisitPie);
      Object.assign(this, this.dataConformedPie);
    });

    this.screenSpinnerService.hide(200);
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
        "name": "Accepté avec Réserve",
        "value": accepted
      },
      {
        "name": "Rejeté",
        "value": nonConform
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
