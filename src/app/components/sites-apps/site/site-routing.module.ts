import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SiteComponent} from "./site.component";
import {SiteListComponent} from "./site-list/site-list.component";
import {SiteViewComponent} from "./site-view/site-view.component";


const routes: Routes = [
  {
    path: "",
    component: SiteComponent,
    children: [
      {
        path: "",
        component: SiteListComponent
      },
      {
        path: ":id",
        component: SiteViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule {
}
