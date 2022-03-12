import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { QuestionsService } from 'src/app/training/questions.service';
import { jsPDF } from "jspdf";
import "jspdf/dist/polyfills.es.js";
@Component({
  selector: 'app-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.css']
})
export class MarkdownRendererComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
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

  setValues(event: any, edit: any) {
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

  public SavePDF(): void {  
    //console.log(this.content.nativeElement.innerText)
    let doc = new jsPDF();   
    doc.setFontSize(12);
    doc.setFont("helvetica");
    doc.text(this.content.nativeElement.innerText, 10, 10);
    doc.save('test.pdf');  
  } 
}
