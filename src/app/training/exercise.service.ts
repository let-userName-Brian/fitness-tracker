import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Exercise } from "./exercise.model"

@Injectable({ providedIn: "root" })
export class ExerciseService {
  exerciseChanged = new Subject<Exercise>();
  availableExercises: Exercise[] = [
     { id: "patrolman", name: "Patrolman", duration: 30, questions: 50 }, 
     { id: "flight-chief", name: "Flight Chief", duration: 45, questions: 50 },
     { id: "BDOC", name: "Desk Sgt", duration: 30, questions: 55 },
  ];

  private runningExercise: Exercise;

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise})
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }
}