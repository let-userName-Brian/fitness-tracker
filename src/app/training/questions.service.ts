import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ExerciseService } from "./exercise.service";

@Injectable({ providedIn: "root" })
export class QuestionsService {
  private databank: string;
  fetchedQuestions: any;
  newQuestion: any;
  editedQuestion: any;

  verbalsCompleted: any; //holds all verbals and is used for the cards awaiting practical
  allCompletedQCs: any; //holds all fully completed and is used for the data table

  constructor(private http: HttpClient, private router: Router, private exerciseService: ExerciseService) { }

  getNameofQuestionBank(qc: string) {
    this.databank = qc;
    switch (qc) {
      case "Flight Sargent":
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
    while (randomQuestions.length < 25) {
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
    });
  }

  /**
   * 
   * @param score the score of the QC
   * @param exam the exam to be completed
   * @returns finishes the QC and moves it to the awaiting practical page
   */
  completedVerbal(score: number, exam: any) {
    let id = exam.id;
    return this.http.post(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedVerbals/${id}.json`, {
      exam: exam,
      score: score,
      user: this.exerciseService.userName
    })
  }

  /**
   * 
   * @param exam the exam to be deleted
   * @returns removes the QC from the completed verbals so it doesnt show up as awaiting practical
   */
  deleteVerbalCompleted(exam: any) {
    let id = exam.id;
    return this.http.delete(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedVerbals/${id}.json`)
  }

  /**
   * 
   * @param score the score of the QC
   * @param exam the actual exam
   * @returns moves the qc to the completed screen and data table
   */
  completedPractical(score: number, exam: any) {
    let id = exam.id;
    return this.http.post(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedQCs/${id}.json`, {
      exam: exam,
      score: score,
      user: this.exerciseService.userName
    })
  }

  /**
   * 
   * @param exam the exam to be deleted
   * @returns 
   * needs a subscription to be used but deletes a full QC from the DB
   */
  deleteQC(exam:any){
    let id = exam.id;
    return this.http.delete(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedQCs/${id}.json`)
  }


  /**
   * 
   * @returns the completed verbals
   * used for the cards on the verbal completed page
   */
  getVerbalCompleted() {
    return this.http.get(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedVerbals.json`).subscribe((response: any) => {
        this.verbalsCompleted = response;
      });
  }

  /**
   * 
   * @returns all completed QC's
   * used for the data table
   */
  getCompletedQCs() {
    return this.http.get(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedQCs.json`).subscribe((response: any) => {
        this.allCompletedQCs = response;
      });
  }
}