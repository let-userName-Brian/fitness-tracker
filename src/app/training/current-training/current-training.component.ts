import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Exercise } from '../exercise.model';
import { ExerciseService } from '../exercise.service';
import { StopTrainingComponent } from './stop-training.component';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})

//most of this comonent will need to be restructured to show the curernt test thats being taken and the progress bar
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: any;
  exam: Exercise;
  currentQuestions: any;
  questionsHaveBeenFetched: boolean = false;
  constructor(private dialog: MatDialog, private exerciseService: ExerciseService, private questionService: QuestionsService) { }

  ngOnInit(): void {
    this.exam = this.exerciseService.getRunningExercise();
    console.log(this.exam);
    this.questionService.getQuestions()
  }

  onStart() {
    this.questionsHaveBeenFetched = true;
    this.currentQuestions = this.questionService.fetchedQuestions;
  }

  onDone(){
    this.exerciseService.completeExercise();
    this.onReset();
  }

  onStop() {
    clearInterval(this.timer);
    this.openDialog();
  }

  onReset() {
    clearInterval(this.timer);
    this.progress = 0;
  }

  openDialog() {
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        questions: this.exam.questions
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.exerciseService.cancelExercise(this.exam.questions);
      }
    })
  }
}
