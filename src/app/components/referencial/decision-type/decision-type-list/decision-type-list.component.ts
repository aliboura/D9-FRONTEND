import {Component, OnInit} from '@angular/core';
import {DecisionTypeService} from "../../../../business/services/referencial/decision-type.service";

@Component({
  selector: 'app-decision-type-list',
  templateUrl: './decision-type-list.component.html'
})
export class DecisionTypeListComponent implements OnInit {

  constructor(public decisionTypeService: DecisionTypeService) {
  }

  object = "decisionTypes";
  columns: string[] = ["label"];
  columnsFilter: string[] = ["label"];

  ngOnInit() {
  }

}
