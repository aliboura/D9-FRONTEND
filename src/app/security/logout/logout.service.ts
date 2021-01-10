import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor() {
  }

  showLogout: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public show() {
    this.showLogout.next(true);
  }

  public hide() {
    this.showLogout.next(false);
  }
}
