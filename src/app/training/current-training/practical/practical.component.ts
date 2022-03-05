import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExerciseService } from '../../exercise.service';
import { QuestionsService } from '../../questions.service';

@Component({
  selector: 'app-practical',
  templateUrl: './practical.component.html',
  styleUrls: ['./practical.component.css']
})
export class PracticalComponent implements OnInit {
  verbalCompletedQCs: any;
  constructor(private questionService: QuestionsService, private router: Router) { }


  ngOnInit(){
     this.questionService.getVerbalCompleted();
     setTimeout(() => {
       this.verbalCompletedQCs = this.questionService?.verbalsCompleted;
     }, 600);

  }

  onPass(exam:any, index: number){
    let examId = exam.exam.id
    this.questionService.completedPractical(exam);
    this.questionService.deleteVerbalCompleted(examId);
    this.verbalCompletedQCs.splice(index, 1);
    this.router.navigate(['/past'])
  }

  onFail(exercise:any, index: number){
    let examId = exercise.exam.id
    this.questionService.failPractical(exercise);
    this.questionService.deleteVerbalCompleted(examId);
    this.verbalCompletedQCs.splice(index, 1);
    this.router.navigate(['/past'])
  }
}
