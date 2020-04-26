import {Component, Input, OnInit} from '@angular/core';
import {RoutingStateService} from "../../business/services/apps/routing-state.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Check} from "../../business/models/referencial/check.enum";
import {trigger, state, style, animate, transition} from "@angular/animations";

@Component({
  selector: 'app-after-save',
  templateUrl: './after-save.component.html',
  styleUrls: ['./after-save.component.css'],
  animations: [
    trigger('sucessCard', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('show => hide', animate('600ms ease-out')),
      transition('hide => show', animate('2000ms ease-in'))
    ])
  ]
})
export class AfterSaveComponent implements OnInit {

  constructor(private routingStateService: RoutingStateService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  @Input() result: string;
  @Input() message: string;
  @Input() show = false;

  check = Check;

  ngOnInit() {
  }

  public goToHome() {
    this.router.navigate(['home']);
  }

  public goToPreviousList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  get stateName() {
    return this.show ? "show" : "hide";
  }

}
