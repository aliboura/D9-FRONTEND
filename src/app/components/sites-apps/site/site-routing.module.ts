import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SiteComponent} from "./site.component";
import {SiteListComponent} from "./site-list/site-list.component";
import {SiteViewComponent} from "./site-view/site-view.component";
import {SiteFormsComponent} from "./site-forms/site-forms.component";


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
      },
      {
        path: "forms/:id",
        component: SiteFormsComponent
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
