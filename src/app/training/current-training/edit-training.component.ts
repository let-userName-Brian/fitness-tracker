import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-edit-training",
  template: `<h2 mat-dialog-title>Edit Exam</h2>
              <div>{{ this.exam.exam.question }}</div>
              <div>{{ this.exam.exam.ref }}</div>   
              <div>{{ this.exam.exam.answer }}</div>  
              <div mat-dialog-actions fxLayoutAlign="center">
                <button mat-button color="primary">Close</button>
            </div>`
})
export class EditTrainingComponent{ 
  constructor( @Inject(MAT_DIALOG_DATA) public exam: any){ }

} 