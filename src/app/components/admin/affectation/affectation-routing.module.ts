import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AffectationSiteComponent} from "./affectation-site/affectation-site.component";
import {AffectationComponent} from "./affectation.component";
import {AffectationFirstComponent} from "./affectation-first/affectation-first.component";
import {AffectationEditComponent} from "./affectation-edit/affectation-edit.component";
import {AffectationSecondComponent} from "./affectation-second/affectation-second.component";


const routes: Routes = [{
  path: "",
  component: AffectationComponent,
  children: [
    {
      path: "",
      component: AffectationSiteComponent
    },
    {
      path: "add",
      component: AffectationFirstComponent
    },
    {
      path: "my-programme",
      component: AffectationSecondComponent
    },
    {
      path: ":id",
      component: AffectationEditComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffectationRoutingModule {
}
