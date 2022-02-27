import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class QuestionsService {
  private databank: string;
  fetchedQuestions: any;
  constructor(private http: HttpClient) { }

  getNameofQuestionBank(qc: string) {
    this.databank = qc;
    switch (qc) {
      case "Flight Sargent":
       return this.databank = "FCQuestionBank";
      case "QC2":
        return this.databank = "QC2";
      case "QC3":
        return this.databank = "QC3";
      case "QC4":
        return this.databank = "QC4";
      case "QC5":
        return this.databank = "QC5";
    }
  }
/**
 * @description Filters the questions to a limit of 25 and randomizes the questions
 *  *possible refactor*
 */
  filterQuestions(){
    let randomQuestions = [];
    let randomIndex = 0;
    let randomQuestion = null;
    while(randomQuestions.length < 25){
      randomIndex = Math.floor(Math.random() * this.fetchedQuestions.length);
      randomQuestion = this.fetchedQuestions[randomIndex];
      if(randomQuestions.indexOf(randomQuestion) === -1){
        randomQuestions.push(randomQuestion);
      }
    }
    this.fetchedQuestions = randomQuestions;
  }

  getQuestions() {
    let params = this.databank;
    return this.http.get(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/${params}.json`).subscribe((response: any) => {
      this.fetchedQuestions = response;
      this.filterQuestions();
    });
  }
}
