import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-site-not-planified',
  templateUrl: './site-not-planified.component.html'
})
export class SiteNotPlanifiedComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  @Input() siteCode: string;
  @Input() message: string;

}
