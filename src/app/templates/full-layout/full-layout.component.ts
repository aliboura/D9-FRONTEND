import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { TranslateService } from "@ngx-translate/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full-layout.component.html",
  styleUrls: ["./full-layout.component.css"]
})
export class FullLayoutComponent implements OnInit, OnDestroy {
  constructor(
    public media: MediaMatcher,
    public changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    translate.setDefaultLang("fr");
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/fe|en/) ? browserLang : "fr");
  }

  mobileQuery: MediaQueryList;
  defaultLang: string;

  private mobileQueryListener: () => void;

  ngOnInit() {
    this.defaultLang = this.translate.getBrowserLang();
    this.defaultLang = "Français";
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  public switchToEnglish() {
    this.translate.setDefaultLang("en");
    this.translate.use("en");
    this.defaultLang = "English";
  }

  public switchToFrensh() {
    this.translate.setDefaultLang("fr");
    this.translate.use("fr");
    this.defaultLang = "Français";
  }
}
