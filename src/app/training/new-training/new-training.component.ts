import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ExerciseService } from '../exercise.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
@Output() trainingStart = new EventEmitter<void>();
availableExercises: Exercise[] = []
  constructor(private exerciseService: ExerciseService) { }

  ngOnInit(): void {
    this.availableExercises = this.exerciseService.getAvailableExercises()
  }

  onStartTraining(form: NgForm): void{
    this.exerciseService.startExercise(form.value.exam)
  }
}
