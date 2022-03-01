import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: "app-edit-training",
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.css']
})
export class EditTrainingComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public exam: any, private fb: FormBuilder) { }
  @ViewChild('f') editForm: NgForm;
  
  submitEditedQuestion(form: NgForm) {
    console.log(form)
  }

  ngOnInit(): void {
    console.log('onInit fired')
  }
}
