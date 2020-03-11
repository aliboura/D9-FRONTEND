import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScreenSpinnerService {

  constructor() {
  }

  showSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public show() {
    if (!this.showSpinner.getValue()) {
      this.showSpinner.next(true);
    }
  }

  public hide() {
    if (this.showSpinner.getValue()) {
      this.showSpinner.next(false);
    }
  }


}
