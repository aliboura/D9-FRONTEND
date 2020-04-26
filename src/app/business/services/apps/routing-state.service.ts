import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RoutingStateService {

  constructor(private router: Router) {
  }

  private history = [];
  private last = "";

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  public loadLastRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.last = urlAfterRedirects;
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getLastLink(): string {
    return this.last;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || 'home';
  }

  public getPreviousList(): string {
    const route = this.history[this.history.length - 3];
    if (route.toString().includes("add")) {
      const route2 = this.history[this.history.length - 4];
      if (route2.toString().includes("search")) {
        return this.history[this.history.length - 5] || 'home';
      }
    } else {
      return route || 'home';
    }
  }

}
