import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  @ViewChild('correct') correct: any;
  @ViewChild('wrong') wrong: any;
  exam: Exercise;
  currentQuestions: any;
  questionsHaveBeenFetched: boolean = false;
  score: number = 0;
  editingQuestion: any;
  answerWrongBoolean: boolean = false;

  questionsAnswered: any = [];

  constructor(
    private dialog: MatDialog,
    private exerciseService: ExerciseService,
    private questionService: QuestionsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.exam = this.exerciseService.getRunningExercise();
    this.questionService.getQuestions()
  }

  correctAnswer(exam: any) {
    if (this.questionsAnswered.includes(exam.id)) return
    this.questionsAnswered.push(exam.id)
    if (this.currentQuestions.length > 25) this.score += 2;
    if (this.currentQuestions.length <= 25) this.score += 4;
    this.questionService.correctQuestion(exam);
  }

  wrongAnswer(index: number, exam: any) {
    if (this.questionsAnswered.includes(exam.id)) return;
    this.questionsAnswered.push(exam.id)
    this.questionService.wrongAnswerArray.push(this.currentQuestions[index]);
    this.questionService.wrongQuestion(exam);
  }

  newQuestion(index: number) {
    this.questionService.getNewSingleQuestion();
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
