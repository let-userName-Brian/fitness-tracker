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
  }

  passQC(exercise: any) {
    this.addToDatabase({
      ...exercise.exam,
      date: new Date(),
      user: exercise.user,
      state: "completed",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    this.deletefromVerbalCompleted(exercise);
  }

  failExercise(exercise: any) {
    this.addToDatabase({
      ...exercise.exam,
      date: new Date(),
      user: exercise.user,
      state: "cancelled",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    this.deletefromVerbalCompleted(exercise);
  }

  cancelExercise(questions: number) {
    this.addToDatabase({
      ...this.runningExercise,
      questions: this.runningExercise.questions - questions,
      date: new Date(),
      user: this.userName,
      state: "canceled",
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

  private deletefromVerbalCompleted(verbalDone: any) {
    this.dataBase.collection("verbalCompleteQC's").doc(verbalDone.exam.id).delete().then(() => {
      console.log("deleted from database:", verbalDone);
      console.log("deleted from database:", verbalDone.exam.id);
      console.log("deleted from database:", verbalDone.user);
    }).catch(err => {
      console.log(err)
    })
  }

  cancelSubscriptions() {
    this.firebaseSubscription.forEach(sub => sub.unsubscribe());
  }
}
