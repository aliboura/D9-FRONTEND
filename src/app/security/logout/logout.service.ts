import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private screenSpinnerService: ScreenSpinnerService) {
  }

  showLogout: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public show() {
    this.screenSpinnerService.hide(200);
    this.showLogout.next(true);
  }

  public hide() {

    this.showLogout.next(false);
  }
}
