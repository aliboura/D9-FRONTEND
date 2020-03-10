import {Component, OnInit} from '@angular/core';
import {DecisionService} from "../../../../business/services/referencial/decision.service";

@Component({
  selector: 'app-decision-list',
  templateUrl: './decision-list.component.html'
})
export class DecisionListComponent implements OnInit {

  constructor(public decisionService: DecisionService) {
  }

  title = "Liste des décisions";
  object = "decisions";

  columns: string[] = ["label", "position", "status"];

  ngOnInit() {
  }

}
