import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Exercise } from '../exercise.model';
import { ExerciseService } from '../exercise.service';
import { StopTrainingComponent } from './stop-training.component';
import { QuestionsService } from '../questions.service';
import { EditTrainingComponent } from './edit-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  exam: Exercise;
  currentQuestions: any;
  questionsHaveBeenFetched: boolean = false;
  score: number = 100;
  editingQuestion: any;

  constructor(private dialog: MatDialog, private exerciseService: ExerciseService, private questionService: QuestionsService) { }

  ngOnInit(): void {
    this.exam = this.exerciseService.getRunningExercise();
    this.questionService.getQuestions()
  }

  correctAnswer() {
    //this.score += 4;
  }

  newQuestion(index: number) {
    this.questionService.getNewSingleQuestion();
    setTimeout(() => {
      this.currentQuestions.splice(index, 1, this.questionService.newQuestion);
    }, 200)
  }

  onEdit(index: number, questions: any) {
    console.log("id", index)
    console.log("qs", questions)
    this.editingQuestion = questions;
    this.openEditDialog(index, questions);
  }
  wrongAnswer() {
    this.score -= 4;
  }

  onStart() {
    this.questionsHaveBeenFetched = true;
    this.currentQuestions = this.questionService.fetchedQuestions;
  }

  onDone() {
    this.exerciseService.completeExercise();
  }

  onStop() {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        score: this.score
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.exerciseService.cancelExercise(this.score);
      }
    })
  }

  openEditDialog(index: number, exam: any) {
    const dialogRef = this.dialog.open(EditTrainingComponent, {
      data: {
        exam: this.editingQuestion
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentQuestions.splice(index, 1, result);
      }
    })
  }
}
