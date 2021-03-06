import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditService } from '../edit.service';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.css']
})
export class AddModalComponent implements OnInit {

  constructor(private fb: FormBuilder, private editService: EditService) { }

  addForm = this.fb.group({
    answer: ['', Validators.required],
    asked: [0, Validators.required],
    correct: [0, Validators.required],
    wrong: [0, Validators.required],
    question: ['', Validators.required],
    ref: ['', Validators.required],
  })
  ngOnInit(): void {
  }

  addQuestion(){
    this.editService.addQuestion(this.addForm.value);
  }
}
