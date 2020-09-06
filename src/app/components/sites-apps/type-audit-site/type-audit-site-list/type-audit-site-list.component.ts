import {Component, OnInit} from '@angular/core';
import {TypeAuditSiteService} from "../../../../business/services/sites/type-audit-site.service";

@Component({
  selector: 'app-type-audit-site-list',
  templateUrl: './type-audit-site-list.component.html'
})
export class TypeAuditSiteListComponent implements OnInit {

  constructor(public typeAuditSiteService: TypeAuditSiteService) {
  }

  object = "typeAudit";

  columns: string[] = ["label", "description", "status"];

  ngOnInit() {
  }

}
