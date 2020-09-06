import {Component, OnInit} from '@angular/core';
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html'
})
export class ReportingComponent implements OnInit {

  constructor(private screenSpinnerService: ScreenSpinnerService) {
  }

  ngOnInit() {
    this.screenSpinnerService.hide(200);
  }

}
