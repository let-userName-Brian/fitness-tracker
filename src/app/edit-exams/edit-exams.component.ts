import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExerciseService } from '../training/exercise.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { EditService } from './edit.service';
import { MatDialog } from '@angular/material/dialog';
import { AddModalComponent } from './add-modal/add-modal.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';

@Component({
  selector: 'app-edit-exams',
  templateUrl: './edit-exams.component.html',
  styleUrls: ['./edit-exams.component.css']
})
export class EditExamsComponent implements OnInit, OnDestroy {
  qcSubscription: Subscription;
  availableExercises: any;
  selectedQuesitons: any;
  constructor(private exerciseService: ExerciseService, private editService: EditService, private dialog: MatDialog) { }

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
    }, 400);
  }

  onEdit(question: any, i) {
    this.openEditDialog(question, i);
  }

  onDelete(index: number) {
    this.editService.deleteQuestion(index);
    this.selectedQuesitons.splice(index, 1);
  }

  onAdd() {
    this.openAddDialog()
  }


  openAddDialog() {
    const dialogRef = this.dialog.open(AddModalComponent)
    dialogRef.afterClosed().subscribe();
  }

  openEditDialog(question: any, i: number) {
    const dialogRef = this.dialog.open(EditModalComponent, {
      data: {
        question: question,
        index: i
      }
    })
    dialogRef.afterClosed().subscribe()
  }
}
