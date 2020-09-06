import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {MediaMatcher} from "@angular/cdk/layout";
import {TranslateService} from "@ngx-translate/core";
import {STATIC_DATA} from "../../tools/static-data";
import {LoginService} from "../../security/login.service";
import {CookieService} from "ngx-cookie-service";
import {NavigationEnd, Router, RouterEvent} from "@angular/router";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";
import {RoutingStateService} from "../../business/services/apps/routing-state.service";
import {JwtTokenService} from "../../business/services/apps/jwt-token.service";
import {VisitPlanningService} from "../../business/services/sites/visit-planning.service";
import {AppNotificationService} from "../../business/services/apps/app-notification.service";
import {Observable} from "rxjs";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full-layout.component.html",
  styleUrls: ["./full-layout.component.css"]
})
export class FullLayoutComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    public media: MediaMatcher,
    public changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private cookieService: CookieService,
    public jwtTokenService: JwtTokenService,
    private loginService: LoginService,
    private appNotificationService: AppNotificationService,
    private routingStateService: RoutingStateService,
    private screenSpinnerService: ScreenSpinnerService
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    translate.setDefaultLang("fr");
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/fe|en/) ? browserLang : "fr");
    this.routingStateService.loadLastRouting();
    this.router.events.subscribe(
      (event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
          this.admin = this.jwtTokenService.isAdmin();
        }
      });

  }

  mobileQuery: MediaQueryList;
  defaultLang: string;
  userName = "";
  admin: boolean;
  myCount: Observable<number>;

  private mobileQueryListener: () => void;

  ngOnInit() {
    this.defaultLang = this.translate.getBrowserLang();
    this.defaultLang = "Français";
    this.myCount = this.appNotificationService.myCount;
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

  get fullName(): string {
    return this.cookieService.get(STATIC_DATA.FULL_NAME);
  }

  public navigate(link: string) {
    if ("/" + link !== this.activeLink) {
      this.screenSpinnerService.show();
    }
    this.router.navigate([link]);
  }

  public goToProfile(link: string) {
    if ("/" + link !== this.activeLink) {
      this.screenSpinnerService.show();
    }
    const params: string = this.cookieService.get('USER_NAME');
    this.router.navigate([link, btoa(params)]);
  }

  public get activeLink() {
    return this.routingStateService.getLastLink();
  }

  public onLogout() {
    this.loginService.onLogOut();
  }
}
