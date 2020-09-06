import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {ScreenSpinnerService} from "../business/services/apps/screen-spinner.service";

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.css'],
})
export class ExceptionsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private screenSpinnerService: ScreenSpinnerService) {
  }

  type_error: string;
  status_error: string;
  url_img: string;
  title_error: string;
  msg_error: string;

  ngOnInit() {
    let status = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.get("code")
      ));
    status.subscribe(x => {
      this.type_error = x;
      this.switchData(this.type_error);
    });
    this.screenSpinnerService.hide(100);
  }

  private switchData(error: string) {
    if (error === '4') {
      this.status_error = "404";
      this.url_img = "./././assets/images/404.svg";
      this.title_error = "Page Not Found";
      this.msg_error = "Requested resource is not available right now. Please try again later";
    } else if (error === '3') {
      this.status_error = "404";
      this.url_img = "./././assets/images/404.svg";
      this.title_error = "Api Not Found";
      this.msg_error = "Requested resource is not available right now. Please try again later";
    } else if (error === '2') {
      this.status_error = "403";
      this.url_img = "./././assets/images/403.svg";
      this.title_error = "Access Denied";
      this.msg_error = "You do not have the necesary permisions. Please contact admins.";
    } else {
      this.status_error = "500";
      this.url_img = "./././assets/images/500.svg";
      this.title_error = "Error Occured";
      this.msg_error = "Something went wrong. Please contact admins.";
    }
  }

}
