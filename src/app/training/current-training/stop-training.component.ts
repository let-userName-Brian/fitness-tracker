import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-stop-training",
  template: `<h2 mat-dialog-title>Exam Cancelled</h2>
              <mat-dialog-content>You sored {{ data.score }} points out of 100</mat-dialog-content>   
              <div mat-dialog-actions fxLayoutAlign="center">
                <button mat-button color="primary" [mat-dialog-close]="true">Close</button>
            </div>`
})
export class StopTrainingComponent { 
  constructor( @Inject(MAT_DIALOG_DATA) public data: any ){ }
}  