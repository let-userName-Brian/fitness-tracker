import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Exercise } from "./exercise.model"
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from "rxjs";

@Injectable({ providedIn: "root" })
export class ExerciseService {
  exerciseChanged = new Subject<Exercise>();
  qcChanged = new Subject<Exercise[]>();
  finishedQCsChanged = new Subject<Exercise[]>();
  userName: string;
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private firebaseSubscription: Subscription[] = [];
  

  constructor( private dataBase: AngularFirestore) { }

  fetchAvailableExercises() {
    this.firebaseSubscription.push(this.dataBase.collection<Exercise>("QC's")
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
    )
  }

  startExercise(selectedId: string, membersName: string) {
    // console.log('modifying DB')
    // this.dataBase.doc("pastQC's/" + selectedId).update({
    //   member: this.user.name,
    // })
    this.userName = membersName;
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
      user: this.userName,
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
      user: this.userName,
      state: "cancelled",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  fetchCompletedOrCancelledExercises() {
    this.firebaseSubscription.push(this.dataBase.collection("pastQC's").valueChanges().subscribe((qcs : Exercise[]) => {
      this.finishedQCsChanged.next(qcs);
    })
    );
  }

  private addToDatabase(exercise: Exercise) {
    this.dataBase.collection("pastQC's").add(exercise).then(() => {
      console.log("added to database:", exercise.user);
    }).catch(err => {
      console.log(err)
    })
  }

  cancelSubscriptions() {
    this.firebaseSubscription.forEach(sub => sub.unsubscribe());
  }

}
