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

  onLoad(event) {
    console.log(event);
  }

  onError(event) {
    console.log(event);
  }

  ngOnInit(): void {
    this.loadedMD = this.questionService.allCompletedQCs[0]
    setTimeout(() => {
      console.log(this.loadedMD);
    }, 1000);
  }

}
