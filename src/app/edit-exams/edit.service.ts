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
        return this.databank = "AM";
      case "Boat Operator":
        return this.databank = "BO";
      case "DAF - Patrol":
        return this.databank = "DAFPT";
      case "Confinement":
        return this.databank = "CO"; 
    }
  }

  getSelectedQuestionBank(qc: string) {
    this.getNameofQuestionBank(qc);
    console.log('testing',this.databank);
    return this.http.get(`https://qc-database-e638d-default-rtdb.firebaseio.com/${this.databank}/${this.databank}.json`).subscribe(
      (response: any) => {
        this.selectedQuesitonsBank = response;
      }
    )
  }

  editQuestion(question: any, i: number) {
    return this.http.patch(`https://qc-database-e638d-default-rtdb.firebaseio.com/${this.databank}/${this.databank}/${i}.json`, {
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
    return this.http.delete(`https://qc-database-e638d-default-rtdb.firebaseio.com/${this.databank}/${this.databank}/${index}.json`).subscribe(
      () => {
        this.selectedQuesitonsBank.splice(index, 1);
        setTimeout(() => {
          this.selectedQuesitonsBank.splice();
        }, 200);
      });
  }

  addQuestion(question: any) {
    let id = this.selectedQuesitonsBank.length;
    return this.http.put(`https://qc-database-e638d-default-rtdb.firebaseio.com/${this.databank}/${this.databank}/${id}.json`, {
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
