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
  qcChanged = new Subject<Exercise[]>();
  finishedQCsChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  
  user: User = this.authService.getUser();

  constructor(private authService: AuthService, private dataBase: AngularFirestore) { }

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
    // console.log('modifying DB')
    // this.dataBase.doc("QC's/" + selectedId).update({
    //   member: this.user.name,
    // })
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise })
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  completeExercise() {
    this.addToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: "completed",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(questions: number) {
    this.addToDatabase({
      ...this.runningExercise,
      questions: this.runningExercise.questions - questions,
      date: new Date(),
      state: "cancelled",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    console.log(this.user)
  }

  fetchCompletedOrCancelledExercises() {
    this.dataBase.collection("pastQC's").valueChanges().subscribe((qcs : Exercise[]) => {
      this.finishedQCsChanged.next(qcs);
    })
  }

  private addToDatabase(exercise: Exercise) {
    this.dataBase.collection("pastQC's").add(exercise).then(() => {
      console.log("added to database")
    }).catch(err => {
      console.log(err)
    })
  }

}