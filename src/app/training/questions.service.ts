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

  getQuestions() {
    let params = this.databank;
    return this.http.get(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/${params}.json`
    ).subscribe((response: any) => {
      this.fetchedQuestions = response;
    });
  }
}
