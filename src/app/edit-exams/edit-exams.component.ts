import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExerciseService } from '../training/exercise.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { EditService } from './edit.service';

@Component({
  selector: 'app-edit-exams',
  templateUrl: './edit-exams.component.html',
  styleUrls: ['./edit-exams.component.css']
})
export class EditExamsComponent implements OnInit, OnDestroy {
  qcSubscription: Subscription;
  availableExercises: any;
  selectedQuesitons: any;
  constructor(private exerciseService: ExerciseService, private editService: EditService) { }

  ngOnInit(): void {
    this.qcSubscription = this.exerciseService.qcChanged.subscribe(
      qcs => this.availableExercises = qcs
    );
    this.exerciseService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.qcSubscription.unsubscribe();
  }

  onSelectedEdit(form: NgForm) {
    this.editService.getSelectedQuestionBank(form.value.exam);
    setTimeout(() => {
      this.selectedQuesitons = this.editService.selectedQuesitonsBank;
    }, 200);
  }

  onEdit(question:any, i){
    console.log(question);
    console.log(i);
    let id = question.id;
    //console.log("index at comp", id)
    this.editService.editQuestion(question, i);
  }

  onDelete(index:number){
    this.editService.deleteQuestion(index);
  }
}
