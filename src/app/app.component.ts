import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "./business/services/apps/screen-spinner.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'network-acceptance';

  constructor(private spinner: NgxSpinnerService,
              public screenSpinnerService: ScreenSpinnerService) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.screenSpinnerService.show();
    setTimeout(() => {
      this.spinner.hide();
      this.screenSpinnerService.hide();
    }, 1000);
  }
}
