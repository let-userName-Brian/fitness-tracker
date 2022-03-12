import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subscription } from "rxjs";

@Injectable({ providedIn: "root" })
export class QuestionsService {
  private databank: string;
  fetchedQuestions: any;
  newQuestion: any;
  editedQuestion: any;
  alertIcon: number;
  userName: string;

  wrongAnswerArray: any = [];

  verbalsCompleted: any; //holds all verbals and is used for the cards awaiting practical
  allCompletedQCs: any; //holds all fully completed and is used for the data table
  loadDPEReport$: Observable<any>; //a loaded DPE report from the past training component 
  updatedDPE$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) { }

  getNameofQuestionBank(qc: string) {
    this.databank = qc;
    switch (qc) {
      case "Flight Sergeant":
        return this.databank = "FS";
      case "RFL - Patrol":
        return this.databank = "RFL";
      case "IEC/RFM":
        return this.databank = "RFM";
      case "Security Controller":
        return this.databank = "SC";
      case "Armorer":
        return this.databank = "Armory";
      case "Alarm Monitor":
        return this.databank = "AM"
    }
  }

  filterQuestions() {
    let randomQuestions = [];
    let randomIndex = 0;
    let randomQuestion = null;
    let numQuestions = 25
    if(this.databank === "FS" || this.databank === "AM" || this.databank === "SC"){
      numQuestions = 50
    }
    while (randomQuestions.length < numQuestions) {
      randomIndex = Math.floor(Math.random() * this.fetchedQuestions.length);
      randomQuestion = this.fetchedQuestions[randomIndex];
      if (randomQuestions.indexOf(randomQuestion) === -1) {
        randomQuestions.push(randomQuestion);
      }
    }
    this.fetchedQuestions = randomQuestions;
  }

  getQuestions() {
    let params = this.databank;
    return this.http.get(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/${params}/${params}.json`).subscribe((response: any) => {
        this.fetchedQuestions = response;
        this.filterQuestions();
      });
  }

  getNewSingleQuestion() {
    let params = this.databank;
    let rand = Math.floor(Math.random() * this.fetchedQuestions.length);
    return this.http.get(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/${params}/${params}/${rand}.json`).subscribe((response: any) => {
        this.newQuestion = response;
      });
  }

  editQuestion(form: any) {
    let params = this.databank;
    let id = form.id;
    return this.http.patch(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/${params}/${params}/${id}.json`, {
      question: form.question,
      answer: form.answer,
      ref: form.ref,
      asked: form.asked,
      correct: form.correct,
      wrong: form.wrong,
      id: form.id,
    }).subscribe((response: any) => {
      this.editedQuestion = response;
      alert("Question edited");
    });
  }

  /**
   * 
   * @param score the score of the QC
   * @param exam the exam to be completed
   * @returns finishes the QC and moves it to the awaiting practical page
   */
  completedVerbal(score: number, exam: any) {
    return this.http.put(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedVerbals/${exam.id}.json`, {
      exam: exam,
      date: new Date(),
      score: score,
      user: this.userName,
      wrongAnswers: this.wrongAnswerArray
    }).subscribe();
  }

  /**
   * 
   * @param exam the exam to be deleted
   * @returns removes the QC from the completed verbals so it doesnt show up as awaiting practical
   */
  deleteVerbalCompleted(exam: any) {
    return this.http.delete(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedVerbals/${exam}.json`).subscribe(() => {
        this.getCompletedQCs();
    });
  }

  /**
   * 
   * @param score the score of the QC
   * @param exam the actual exam
   * @returns moves the qc to the completed screen and data table & state as "go"
   */
  completedPractical(exam: any) {
    return this.http.post(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedQCs.json`, {
      exam: exam,
      state: 'go'
    }).subscribe();
  }

  failPractical(exam: any) {
    return this.http.post(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedQCs.json`, {
      exam: exam,
      state: 'no-go'
    }).subscribe();
  }

  /**
   * 
   * @param score 
   * @param exam 
   * @returns returns the state as "cancel"
   */
  onCancelQC(score: number, exam: any) {
    return this.http.patch(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedQCs.json`, {
      exam: exam,
      score: score,
      state: 'cancel'
    })
  }
  /**
   * 
   * @param score 
   * @param exam 
   * @returns returns the state as "no-go"
   */
  onFailQC(score: number, exam: any) {
    return this.http.put(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedVerbals/${exam.id}.json`, {
      exam: exam,
      date: new Date(),
      score: score,
      user: this.userName,
      state: 'no-go'
    }).subscribe();
  }
  /**
   * 
   * @param exam the exam to be deleted
   * @returns 
   * needs a subscription to be used but deletes a full QC from the DB
   */
  deleteQC(exam: any) {
    let id = exam.id;
    return this.http.delete(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedQCs/${id}.json`).subscribe((res) => {
        console.log(res)
    });
  }


  /**
   * 
   * @returns the completed verbals
   * used for the cards on the verbal completed page
   */
  getVerbalCompleted() {
    console.log("getting completed verbals")
    return this.http.get(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedVerbals.json`).subscribe((response: any) => {
        let arr = [];
        for (let key in response) {
          arr.push(response[key]);
        }
        this.verbalsCompleted = arr;
        this.alertIcon = this.verbalsCompleted.length 
        });
      }
      


  /**
   * 
   * @returns all completed QC's
   * used for the data table
   */
  getCompletedQCs() {
    console.log("getting completed qcs")
    return this.http.get(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedQCs.json`).subscribe((res: any) => {
        let arr = [];
        for (let key in res) {
          arr.push(res[key]);
        }
        this.allCompletedQCs = arr;
      });
    
  }

  loadDPE(exam: any){
    this.loadDPEReport$ = exam;
  }

  updateDPEReport(exam: any){
    this.loadDPEReport$ = exam;
    setTimeout(() => {
   console.log(this.loadDPEReport$) 
    }, 400);
  }

}