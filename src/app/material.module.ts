import { NgModule } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  imports: [
    // import all the modules that are required
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    // export all the modules that are required
    MatButtonModule,
    MatIconModule
  ]

})

export class MaterialModule {

}
