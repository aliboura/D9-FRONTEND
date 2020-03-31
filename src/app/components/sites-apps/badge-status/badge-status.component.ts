import {Component, Input, OnInit} from '@angular/core';
import {CategoriesLabel} from "../../../business/models/referencial/categories-label.enum";

@Component({
  selector: 'app-badge-status',
  templateUrl: './badge-status.component.html'
})
export class BadgeStatusComponent implements OnInit {

  constructor() {
  }

  @Input() label: string;
  categoriesEnum = CategoriesLabel;

  ngOnInit() {
  }

}
