import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs-compat/operator/switchMap';
import { QuestionsService } from 'src/app/training/questions.service';

@Component({
  selector: 'app-markdown-options',
  templateUrl: './markdown-options.component.html',
  styleUrls: ['./markdown-options.component.css']
})
export class MarkdownOptionsComponent implements OnInit {
  selectedMD: any;
  constructor(private fb: FormBuilder, private questionService: QuestionsService) { }

  edit = this.fb.group({
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
    // console.log("value", event)
    // console.log("form name", edit)
    this.edit.patchValue({
      edit: event
    })
    //console.log("form", this.edit.value)
    this.questionService.updateDPEReport(this.edit.value)
  }

  
  ngOnInit(): void {
    this.selectedMD = this.questionService.loadDPEReport$
    this.edit.setValue({
      name: this.selectedMD.member,
      flight: '',
      eval: this.selectedMD.exam.exam.name,
      rating: '',
      missed: '',
      shoot: '',
      practical: '',
      synopsis: '',
      signature: ''
    })
  }

}
