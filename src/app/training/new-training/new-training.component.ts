import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ExerciseService } from '../exercise.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
@Output() trainingStart = new EventEmitter<void>();
availableExercises: Observable<any>;
  constructor(private exerciseService: ExerciseService, private dataBase: AngularFirestore) { }

  ngOnInit(): void {
    this.availableExercises = this.dataBase.collection("QC's").valueChanges()
    //this.availableExercises = this.exerciseService.getAvailableExercises()
  }

  onStartTraining(form: NgForm): void{
    this.exerciseService.startExercise(form.value.exam)
  }
}
