import { Component, OnInit } from '@angular/core';
import { MatDialog, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { Exercise } from '../exercise.model';
import { ExerciseService } from '../exercise.service';
import { StopTrainingComponent } from './stop-training.component';
import { QuestionsService } from '../questions.service';
import { EditTrainingComponent } from './edit-modal/edit-training.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  exam: Exercise;
  currentQuestions: any;
  questionsHaveBeenFetched: boolean = false;
  score: number = 0;
  editingQuestion: any;
  answerWrongBoolean: boolean = false;

  constructor(private dialog: MatDialog,
    private exerciseService: ExerciseService,
    private questionService: QuestionsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.exam = this.exerciseService.getRunningExercise();
    this.questionService.getQuestions()
  }

  correctAnswer() {
    if(this.currentQuestions.length === 50) {
    this.score += 2;
    } else {
    this.score += 4;
    }
  }

  wrongAnswer(index: number) {
    if(this.currentQuestions.length === 50) {
      this.score -= 2;
      } else {
      this.score -= 4;
      }
      this.questionService.wrongAnswerArray.push(this.currentQuestions[index]);
      console.log(this.questionService.wrongAnswerArray);
  }

  newQuestion(index: number) {
    this.questionService.getNewSingleQuestion();
    setTimeout(() => {
      this.currentQuestions.splice(index, 1, this.questionService.newQuestion);
    }, 200)
  }

  onEdit(index: number, questions: any) {
    this.editingQuestion = questions;
    this.openEditDialog(index, questions);
  }

  onStart() {
    this.questionsHaveBeenFetched = true;
    this.currentQuestions = this.questionService.fetchedQuestions;
  }

  onPass() {
    this.questionService.completedVerbal(this.score, this.exam);
    this.router.navigate(['']);
  }

  onFail() {
    this.questionService.onFailQC(this.score, this.exam);
    this.router.navigate(['']);
  }

  onCancel() {
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
        this.questionService.onCancelQC(this.score, this.exam)
        this.router.navigate([''])
      }
    })
  }

  openEditDialog(index: number, exam: any) {
    const dialogRef = this.dialog.open(EditTrainingComponent, {
      data: {
        exam: this.editingQuestion
      }
    })
  }
}
