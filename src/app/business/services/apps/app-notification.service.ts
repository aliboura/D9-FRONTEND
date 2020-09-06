import {Injectable, OnInit} from '@angular/core';
import {VisitPlanningService} from "../sites/visit-planning.service";
import {BehaviorSubject} from "rxjs";
import {JwtTokenService} from "./jwt-token.service";

@Injectable({
  providedIn: 'root'
})
export class AppNotificationService implements OnInit {

  private _myCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private jwtTokenService: JwtTokenService,
    private visitPlanningService: VisitPlanningService) {
  }

  ngOnInit(): void {
    this.visitPlanningService.notificationCount(this.jwtTokenService.getUserName())
      .subscribe(count => {
        this._myCount.next(count);
      });
  }

  get myCount() {
    return this._myCount.asObservable();
  }

  setMyCount(count: number): void {
    return this._myCount.next(count);
  }


}
