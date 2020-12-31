import {Component, OnInit} from '@angular/core';
import {WilayaRegionService} from "../../../../business/services/referencial/wilaya-region.service";

@Component({
  selector: 'app-wilaya-group-list',
  templateUrl: './wilaya-group-list.component.html'
})
export class WilayaGroupListComponent implements OnInit {

  constructor(public wilayaRegionService: WilayaRegionService) {
  }

  object = "wilayas";
  columns: string[] = ["label", "regionId"];
  columnsFilter: string[] = ["label", "regionId"];

  ngOnInit() {
    this.object = "wilayas";
  }

}
