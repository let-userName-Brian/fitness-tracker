import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, Validators } from '@angular/forms';
import { EditService } from '../edit.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public question: any, private fb: FormBuilder, private editService: EditService) { }

  editForm = this.fb.group({
    answer: ['', Validators.required],
    asked: ['', Validators.required],
    correct: ['', Validators.required],
    wrong: ['', Validators.required],
    question: ['', Validators.required],
    ref: ['', Validators.required],
  })
  ngOnInit(): void {
    this.editForm.setValue({
      question: this.question.question.question,
      answer: this.question.question.answer,
      ref: this.question.question.ref,
      asked: this.question.question.asked,
      correct: this.question.question.correct,
      wrong: this.question.question.wrong,
    })
  }

  editQuestion() {
    this.editService.editQuestion(this.editForm.value, this.question.index);
  }

}
