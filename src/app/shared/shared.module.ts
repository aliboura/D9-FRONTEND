import { ListGenericComponent } from "./list-generic/list-generic.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsGenericComponent } from "./forms-generic/forms-generic.component";
import { PrimengModule } from "../importes/primeng/primeng.module";
import { MaterialModule } from "../importes/material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [ListGenericComponent, FormsGenericComponent],
  imports: [
    CommonModule,
    PrimengModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [CommonModule, ListGenericComponent, FormsGenericComponent]
})
export class SharedModule {}
