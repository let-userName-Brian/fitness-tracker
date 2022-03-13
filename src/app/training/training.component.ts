import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExerciseService } from './exercise.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html'
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining: boolean = false;
  excerciseSubscription: Subscription;
  constructor(private exerciseService: ExerciseService) { }

  ngOnInit(): void {
    this.excerciseSubscription = this.exerciseService.exerciseChanged.subscribe(
      exercise => {
        if (exercise) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = false;
        }
      })
      
  }

  ngOnDestroy(): void {
    if (this.excerciseSubscription) {
      this.excerciseSubscription.unsubscribe();
    }
  }

}
