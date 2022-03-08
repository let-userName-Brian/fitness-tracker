import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-markdown-options',
  templateUrl: './markdown-options.component.html',
  styleUrls: ['./markdown-options.component.css']
})
export class MarkdownOptionsComponent implements OnInit {
  
  constructor(private fb: FormBuilder) { }

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

  ngOnInit(): void {
  }

}
