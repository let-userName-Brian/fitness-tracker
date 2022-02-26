import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { ExerciseService } from '../exercise.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output() trainingStart = new EventEmitter<void>();
  availableExercises: Exercise[];
  qcSubscription: Subscription;
  constructor(private exerciseService: ExerciseService) { }

  ngOnInit(): void {
    this.qcSubscription = this.exerciseService.qcChanged.subscribe(
      qcs => this.availableExercises = qcs
    );
    this.exerciseService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.qcSubscription.unsubscribe();
  }

  onStartTraining(form: NgForm): void {
    this.exerciseService.startExercise(form.value.exam)
  }
}
