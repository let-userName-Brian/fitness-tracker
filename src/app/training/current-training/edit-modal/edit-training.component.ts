import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionsService } from "../../questions.service";

@Component({
  selector: "app-edit-training",
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.css']
})
export class EditTrainingComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public exam: any, private fb: FormBuilder, private questionService: QuestionsService) { }

  editForm = this.fb.group({
    answer: ['', Validators.required],
    asked: ['', Validators.required],
    correct: ['', Validators.required],
    id: ['', Validators.required],
    wrong: ['', Validators.required],
    question: ['', Validators.required],
    ref: ['', Validators.required],
  })




  submitEditedQuestion() {
    this.questionService.editQuestion(this.editForm.value)
  }

  ngOnInit(): void {
    this.editForm.setValue({
      question: this.exam.exam.question,
      answer: this.exam.exam.answer,
      ref: this.exam.exam.ref,
      asked: this.exam.exam.asked,
      correct: this.exam.exam.correct,
      wrong: this.exam.exam.wrong,
      id: this.exam.exam.id,
    })
  }
}
