import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Exercise } from "./exercise.model"
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from "rxjs";
import { QuestionsService } from "./questions.service";

@Injectable({ providedIn: "root" })
export class ExerciseService {
  exerciseChanged = new Subject<Exercise[]>();
  qcChanged = new Subject<Exercise[]>();
  userName: string;
  verbalDone: any;
  
  private availableExercises: Exercise[] = [];
  private runningExercise: any;
  private firebaseSubscription: Subscription[] = [];
  
  constructor( private dataBase: AngularFirestore, private questionService: QuestionsService) { }

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
    this.userName = membersName;
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise })
    this.questionService.getNameofQuestionBank(this.runningExercise.name);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  completeExercise(score: number, exam: Exercise) {
    let verbalQCCompleted = [{
      exam: exam, 
      score: score, 
      user: this.userName
    }];
    this.verbalDone = verbalQCCompleted;
  }

  cancelSubscriptions() {
    this.firebaseSubscription.forEach(sub => sub.unsubscribe());
  }
}
