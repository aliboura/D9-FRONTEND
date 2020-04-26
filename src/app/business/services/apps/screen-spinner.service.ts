import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class ScreenSpinnerService {

  constructor(private spinner: NgxSpinnerService) {
  }

  showSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public show() {
    if (!this.showSpinner.getValue()) {
      this.showSpinner.next(true);
      this.spinner.show();
    }
  }

  public hide(times: number) {
    if (this.showSpinner.getValue()) {
      setTimeout(() => {
        this.spinner.hide();
        this.showSpinner.next(false);
      }, times);
    }
  }


  public display() {
    if (this.showSpinner.getValue()) {
      this.spinner.hide();
      this.showSpinner.next(false);
    }
  }
}
