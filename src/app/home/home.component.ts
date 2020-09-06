import {Component, OnInit} from '@angular/core';
import {JwtTokenService} from "../business/services/apps/jwt-token.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }


}
