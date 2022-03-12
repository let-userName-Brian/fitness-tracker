import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgModel } from '@angular/forms';
import { Subject } from 'rxjs';
import { QuestionsService } from 'src/app/training/questions.service';


@Component({
  selector: 'app-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.css']
})
export class MarkdownRendererComponent implements OnInit {
  loadedMD: any;
  loadedDPE: any;
  
  constructor(private questionService: QuestionsService, private fb: FormBuilder) { }

  editForm = this.fb.group({
    name: [''],
    flight: [''],
    eval: [''],
    rating: [''],
    missed: [''],
    shoot: [''],
    practical: [''],
    synopsis: [''],
    signature: ['']
  })
  
  setValues(event: any, edit) {
    this.editForm.patchValue({
      edit: event
    })
  }

  ngOnInit(): void {
    this.loadedMD = this.questionService.loadDPEReport$
    this.loadedDPE = this.questionService.loadDPEReport$
    this.editForm.setValue({
      name: this.loadedDPE.member,
      flight: this.editForm.value.flight,
      eval: this.loadedDPE.exam.exam.name,
      rating: this.editForm.value.rating,
      missed: this.editForm.value.missed,
      shoot: this.editForm.value.shoot,
      practical: this.editForm.value.practical,
      synopsis: this.editForm.value.synopsis,
      signature: this.editForm.value.signature
    })
  }
}
