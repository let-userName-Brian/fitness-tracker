import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class EditService {
  databank: any;
  selectedQuesitonsBank: any;
  constructor(private http: HttpClient) { }

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

  getSelectedQuestionBank(qc: string) {
    this.getNameofQuestionBank(qc);
    return this.http.get(`https://qc-database-aee15-default-rtdb.firebaseio.com/${this.databank}/${this.databank}.json`).subscribe(
      (response: any) => {
        this.selectedQuesitonsBank = response;
      }
    )
  }

  editQuestion(question: any, i: number) {
    return this.http.patch(`https://qc-database-aee15-default-rtdb.firebaseio.com/${this.databank}/${this.databank}/${i}.json`, {
      answer: question.answer,
      asked: question.asked,
      correct: question.correct,
      id: question.id,
      question: question.question,
      ref: question.ref,
      wrong: question.wrong
    }).subscribe(
      () => {
        this.selectedQuesitonsBank.splice(i, 1, question);
      })
  };

  deleteQuestion(index: number) {
    return this.http.delete(`https://qc-database-aee15-default-rtdb.firebaseio.com/${this.databank}/${this.databank}/${index}.json`).subscribe(
      () => {
        this.selectedQuesitonsBank.splice(index, 1);
      });
  }

  addQuestion(question: any) {
    let id = this.selectedQuesitonsBank.length;
      return this.http.put(`https://qc-database-aee15-default-rtdb.firebaseio.com/${this.databank}/${this.databank}/${id}.json`, {
        answer: question.answer,
        asked: question.asked,
        correct: question.correct,
        id: this.selectedQuesitonsBank.length + 1,
        question: question.question,
        ref: question.ref,
        wrong: question.wrong
      }).subscribe(
        (response: any) => {
          this.selectedQuesitonsBank.push(response);
          this.selectedQuesitonsBank.splice()
        })
    };
}
