import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";
import { Exercise } from "./exercise.model"
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: "root" })
export class ExerciseService {
  exerciseChanged = new Subject<Exercise>();
  qcChanged= new Subject<Exercise[]>();
  user: User = this.authService.getUser();

  constructor(private authService: AuthService, private dataBase: AngularFirestore) { }

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private qc: Exercise[] = [];

  fetchAvailableExercises() {
    this.dataBase.collection<Exercise>("QC's")
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            const data: any = doc.payload.doc.data();
            return {
              id: doc.payload.doc.id,
              ...data
            }
          })
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.qcChanged.next([...this.availableExercises]);
      })

  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise })
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  completeExercise() {
    this.qc.push({
      ...this.runningExercise,
      date: new Date(),
      state: "completed",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(questions: number) {
    this.qc.push({
      ...this.runningExercise,
      questions: this.runningExercise.questions - questions,
      date: new Date(),
      state: "cancelled",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    console.log(this.user)
  }

  getCompletedOrCancelledExercises() {
    let user = this.user
    let completedExams = this.qc.slice();
    let payload = user && completedExams
    return payload;
  }
}