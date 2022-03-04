import { Component, OnDestroy, OnInit } from '@angular/core';
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
  constructor(private questionService: QuestionsService) { }


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
    this.questionService.getCompletedQCs();
  }

  onFail(exercise:any, index: number){
    // this.exerciseService.failExercise(exercise);
    // this.verbalCompletedQCs.splice(index, 1);
  }
}
