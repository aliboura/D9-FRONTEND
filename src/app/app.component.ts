import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "./business/services/apps/screen-spinner.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'network-acceptance';

  constructor(private spinner: NgxSpinnerService,
              private translate: TranslateService,
              public screenSpinnerService: ScreenSpinnerService) {
    translate.addLangs(["fr", "en"]);
    translate.setDefaultLang("fr");
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/fr|en/) ? browserLang : "fr");
  }

  ngOnInit(): void {
    this.screenSpinnerService.show();
    this.screenSpinnerService.hide(200);
  }
}
