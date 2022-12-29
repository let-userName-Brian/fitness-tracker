import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Exercise } from '../exercise.model';
import { ExerciseService } from '../exercise.service';
import { StopTrainingComponent } from './stop-training.component';
import { QuestionsService } from '../questions.service';
import { EditTrainingComponent } from './edit-modal/edit-training.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

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
  lodaingNewQ = false;
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

  correctAnswer(exam: any, correct: any, wrong: any) {
    if(correct._checked || wrong._checked) return
    if (this.questionsAnswered.includes(exam.id)) {
      this.lodaingNewQ = true;
      let timerInterval;
      if (this.lodaingNewQ) {
        Swal.fire({
          heightAuto: false,
          title: 'You have already answered this question, let us grab you a new one.',
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        })
      }
      return this.newQuestion(this.currentQuestions.indexOf(exam));
    }
    this.questionsAnswered.push(exam.id)
    if (this.currentQuestions.length > 25) this.score += 2;
    if (this.currentQuestions.length <= 25) this.score += 4;
    this.questionService.correctQuestion(exam);
  }

  wrongAnswer(index: number, exam: any, wrong: any, correct: any ) {
    if(wrong._checked || correct._checked) return
    if (this.questionsAnswered.includes(exam.id)) {
      this.lodaingNewQ = true;
      let timerInterval;
      Swal.fire({
        heightAuto: false,
        title: 'You have already answered this question, let us grab you a new one.',
        timer: 1200,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          timerInterval = setInterval(() => {
            Swal.getTimerLeft()
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
      })
      return this.newQuestion(this.currentQuestions.indexOf(exam));
    }
    this.questionsAnswered.push(exam.id)
    this.questionService.wrongAnswerArray.push(this.currentQuestions[index]);
    this.questionService.wrongQuestion(exam);
  }

  newQuestion(index: number) {
    this.questionService.getNewSingleQuestion().subscribe((newQ: any) => {
      //if the question is already in the array, ge a new one
      setTimeout(() => {
        if (this.questionsAnswered.includes(newQ.id)) return this.newQuestion(index);
        if (!this.questionsAnswered.includes(newQ.id)) {
          this.lodaingNewQ = false;
          Swal.close();
          return this.currentQuestions.splice(index, 1, newQ)
        }
      }, 200);
    });
  };

  onEdit(index: number, questions: any) {
    this.editingQuestion = questions;
    this.openEditDialog(index, questions);
  }

  onStart() {
    this.currentQuestions = this.questionService.fetchedQuestions;
    this.currentQuestions.forEach((question: any, index: number) => {
      if (question === null) {
        this.questionService.getNewSingleQuestion().subscribe((newQ: any) => {
          this.currentQuestions.splice(index, 1, newQ)
        });
      }
    });
    this.questionsHaveBeenFetched = true;
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
