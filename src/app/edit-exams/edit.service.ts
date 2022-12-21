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
        this.databank = "FS";
        return "FS"
      case "RFL - Patrol":
        this.databank = "RFL";
        return "RFL"
      case "IEC/RFM":
        this.databank = "RFM";
        return "RFM"
      case "Security Controller":
        this.databank = "SC";
        return "SC"
      case "Armorer":
        this.databank = "Armory";
        return "Armory"
      case "Alarm Monitor":
        this.databank = "AM";
        return "AM"
      case "Boat Operator":
        this.databank = "BO";
        return "BO"
      case "DAF - Patrol":
        this.databank = "DAFPT";
        return "DAFPT"
      case "Confinement":
        this.databank = "CO";
        return "CO"
    }
  }

  async getSelectedQuestionBank(qc: string) {
    const name = this.getNameofQuestionBank(qc);
    console.log(`Name: ${name}`)
    return this.http.get(`https://qc-database-e638d-default-rtdb.firebaseio.com/${name}/${name}.json`).subscribe(
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
