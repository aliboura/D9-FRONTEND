import {AfterContentChecked, AfterViewChecked, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-empty-messages',
  templateUrl: './empty-messages.component.html'
})
export class EmptyMessagesComponent {

  constructor() {
  }

}
