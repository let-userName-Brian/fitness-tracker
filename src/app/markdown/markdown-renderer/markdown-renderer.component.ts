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
  //full form loaded
  loadedMD: any;
  loadedDPE: any;

  name: string;
  flight = new Subject<string>();
  eval: string;
  rating: string;
  missed: string;
  shoot: string;
  practical: string;
  synopsis: string;
  signature: string;

  showBlock: boolean = false;
  
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

  showBlockTrigger() {
    this.showBlock = true
  }
  setValues(event: any, edit) {
    // console.log("value", event)
    // console.log("form name", edit)
    // this.editForm.patchValue({
    //   edit: event
    // })
    // this.flight = event
    // console.log("flight", this.flight)
    console.log(this.loadedMD)
  }
  reloadMD() {
    console.log("reloadMD")
    //this.loadedMD = this.questionService.loadDPEReport$
  }

  ngOnInit(): void {
    this.loadedMD = this.questionService.loadDPEReport$
    this.loadedDPE = this.questionService.loadDPEReport$
    this.editForm.setValue({
      name: this.loadedDPE.member,
      flight: '',
      eval: this.loadedDPE.exam.exam.name,
      rating: '',
      missed: '',
      shoot: '',
      practical: '',
      synopsis: '',
      signature: ''
    })
    this.flight.subscribe(event => {
      this.eval = event
    })
  }

  onPreviewDomChanged($event) {
    console.log("preview dom changed", $event)
  }

}
