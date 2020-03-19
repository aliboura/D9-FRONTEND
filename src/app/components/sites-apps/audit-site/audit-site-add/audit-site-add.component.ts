import { Component, OnInit } from '@angular/core';
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";

@Component({
  selector: 'app-audit-site-add',
  templateUrl: './audit-site-add.component.html'
})
export class AuditSiteAddComponent implements OnInit {

  constructor(private auditSiteService: AuditSiteService) { }

  ngOnInit() {
  }

}
