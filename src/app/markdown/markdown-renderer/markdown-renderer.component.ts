import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/training/questions.service';


@Component({
  selector: 'app-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.css']
})
export class MarkdownRendererComponent implements OnInit {
  //full form loaded
  loadedMD: any;
  constructor(private questionService: QuestionsService) { }

  ngOnInit(): void {
    this.loadedMD = this.questionService.loadDPEReport
  }

}
