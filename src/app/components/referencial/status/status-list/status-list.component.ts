import {Component, OnInit} from '@angular/core';
import {StatusService} from "../../../../business/services/referencial/status.service";

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html'
})
export class StatusListComponent implements OnInit {

  constructor(public statusService: StatusService) {
  }

  title = "Liste des status";
  object = "status";

  columns: string[] = ["label", "description", "styleCSS"];

  ngOnInit() {
  }

}
