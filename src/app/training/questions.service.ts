import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class QuestionsService {
  private databank: string;
  fetchedQuestions: any;
  newQuestion: any;
  constructor(private http: HttpClient) { }

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
}
