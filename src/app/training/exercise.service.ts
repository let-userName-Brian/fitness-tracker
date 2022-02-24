import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";
import { Exercise } from "./exercise.model"

@Injectable({ providedIn: "root" })
export class ExerciseService {
  exerciseChanged = new Subject<Exercise>();
  user: User = this.authService.getUser();
  availableExercises: Exercise[] = [
     { id: "patrolman", name: "Patrolman", duration: 30, questions: 50, user: { email: "yurik.Garcia.4@spaceforce.mil", name: "Yurik", userId: "12345632342345"} }, 
     { id: "flight-chief", name: "Flight Chief", duration: 45, questions: 50,  user: { email: "Kiley.Davilla.5@spaceforce.mil", name: "Kiley", userId: "12345632390082348"} },
     { id: "BDOC", name: "Desk Sgt", duration: 30, questions: 55,  user: { email: "brian.hardy.4@spaceforce.mil", name: "Brian", userId: "12312342345"} },
  ];
  constructor(private authService: AuthService) {}
  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise})
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: "completed",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      date: new Date(),
      state: "cancelled",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    console.log(this.user)
  }

  getCompletedOrCancelledExercises(){
    let user = this.user
    let completedExams = this.exercises.slice();
    let payload = user && completedExams
    return payload;
  }
}