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
  finishedQCsChanged = new Subject<Exercise[]>();
  
  verbalsChanged = new Subject<any>();
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
    this.addToVerbalCompleted({verbalQCCompleted});
    // this.dataBase.collection("verbalCompleteQC's").add({verbalQCCompleted}).then(() => {
    //   console.log("added to database");
    // }).catch(err => {
    //   console.log(err)
    // })
  }

  cancelExercise(questions: number) {
    this.addToDatabase({
      ...this.runningExercise,
      questions: this.runningExercise.questions - questions,
      date: new Date(),
      user: this.userName,
      state: "Canceled",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  failExercise() {
    this.addToDatabase({
      ...this.runningExercise,
      date: new Date(),
      user: this.userName,
      state: "No-Go",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  fetchCompletedOrCancelledExercises() {
    this.firebaseSubscription.push(this.dataBase.collection("pastQC's").valueChanges().subscribe((qcs : Exercise[]) => {
      this.finishedQCsChanged.next(qcs);
    }));
  }

  fetchVerbalQCCompleted() {
    this.firebaseSubscription.push(this.dataBase.collection("verbalCompleteQC's").valueChanges().subscribe((verbals: any) => {
      this.verbalsChanged.next(verbals);
    }))
  }

  private addToVerbalCompleted(verbalDone: any) {
    this.dataBase.collection("verbalCompleteQC's").add(verbalDone).then(() => {
      console.log("added to database:", verbalDone);
    }).catch(err => {
      console.log(err)
    })
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
