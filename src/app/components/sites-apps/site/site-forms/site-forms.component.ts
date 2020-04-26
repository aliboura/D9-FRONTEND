import {Component, Inject, OnInit} from '@angular/core';
import {SiteFormsService} from "../../../../business/services/sites/site-forms.service";
import {SiteService} from "../../../../business/services/sites/site.service";
import {SiteForms} from "../../../../business/models/sites/site-forms";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {Decision} from "../../../../business/models/referencial/decision";
import {Site} from "../../../../business/models/sites/site";
import {Observable, throwError} from "rxjs";
import {catchError, switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {DomSanitizer} from "@angular/platform-browser";
import {saveAs} from 'file-saver';
import {MatTableDataSource} from "@angular/material/table";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {CookieService} from "ngx-cookie-service";
import {STATIC_DATA} from "../../../../tools/static-data";

@Component({
    selector: 'app-site-forms',
    templateUrl: './site-forms.component.html'
})
export class SiteFormsComponent implements OnInit {

    constructor(private sitesFormsService: SiteFormsService,
                private siteService: SiteService,
                private decisionService: DecisionService,
                private route: ActivatedRoute,
                private router: Router,
                private screenSpinnerService: ScreenSpinnerService,
                private translate: TranslateService,
                private sanitizer: DomSanitizer,
                private jwtTokenService: JwtTokenService,
                private cookieService: CookieService,
                @Inject(NOTYF) private notyf: Notyf) {
    }

    fileName: string;
    sitesForms: SiteForms = new SiteForms();
    id: string;
    site: Site = new Site();
    private obSite: Observable<Site>;
    decisionList: Decision[];
    siteFormsList: MatTableDataSource<SiteForms>;
    displayedColumns: string[] = ['id', 'fileName', 'decisionLabel', 'action'];
    decision: Decision = new Decision();
    isEngineer: boolean;

    ngOnInit() {
        this.decisionService.findAll().subscribe(data => {
            this.decisionList = data.filter(x => x.position === 2);
        });
        this.obSite = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.siteService.findById(atob(params.get("id")))
            )
        );
        this.obSite.subscribe(data => {
            this.site = data;
            this.id = this.site.codeSite;
            this.sitesForms.codeSite = this.site.codeSite;
            this.loadAllFiles(this.site.codeSite);
        });
        const token: string = this.cookieService.get(STATIC_DATA.TOKEN);
        this.isEngineer = this.jwtTokenService.isSiteEngineer(token);
    }

    private loadAllFiles(codeSite: string) {
        this.sitesFormsService.findByCodeSite(codeSite).subscribe(data => {
            this.siteFormsList = new MatTableDataSource<SiteForms>(data);
        });
    }

    onSelect(event) {
        if (event) {
            this.sitesForms.decisionId = event.value.id;
            this.sitesForms.decisionLabel = event.value.label;
        }
    }

    onFileChange(event) {
        let file = event.target.files[0];
        this.fileName = file.name;
        this.sitesForms.fileName = file.name;
        this.sitesForms.fileType = file.name.toString().split(".")[1].toLowerCase();
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
            this.sitesForms.formsFile = reader.result.toString().split(',')[1];
        };
    }


    public save() {
        this.sitesFormsService.createModel(this.sitesForms)
            .pipe(
                catchError(err => {
                    this.notyf.error(this.translate.instant("COMMUN.ERROR_MSG"));
                    return throwError(err);
                })
            )
            .subscribe((data: SiteForms) => {
                this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
                this.router.navigate(['.'], {relativeTo: this.route.parent});
                this.screenSpinnerService.hide(200);
            });
    }

    public showList() {
        this.router.navigate(['.'], {relativeTo: this.route.parent});
    }

    public downloadFile(siteForms: SiteForms) {
        let type = "application/vnd.ms-";
        if (siteForms.fileType === "docx") {
            type = type + "word";
        } else if (siteForms.fileType === "xlsx") {
            type = type + "word";
        }
        const blob = new Blob([this.base64toBlob(siteForms.formsFile, type)], {type: type});
        const file = new File([blob], siteForms.fileName + '.' + siteForms.fileType, {type: type});
        saveAs(file);
    }

    private base64toBlob(base64Data, contentType) {
        contentType = contentType || '';
        const sliceSize = 1024;
        const byteCharacters = atob(base64Data);
        const bytesLength = byteCharacters.length;
        const slicesCount = Math.ceil(bytesLength / sliceSize);
        const byteArrays = new Array(slicesCount);

        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            const begin = sliceIndex * sliceSize;
            const end = Math.min(begin + sliceSize, bytesLength);

            const bytes = new Array(end - begin);
            for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, {type: contentType});
    }

}
