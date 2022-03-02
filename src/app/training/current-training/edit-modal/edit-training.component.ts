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

  editForm = this.fb.group({
    question: ['', Validators.required],
    answer: ['', Validators.required],
    ref: ['', Validators.required]
  })




  submitEditedQuestion() {
    console.log(this.editForm.value)
  }

  ngOnInit(): void {
    console.log('onInit fired')
    this.editForm.setValue({
      question: this.exam.exam.question,
      answer: this.exam.exam.answer,
      ref: this.exam.exam.ref
    })
  }
}
