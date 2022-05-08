import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class QuestionsService {
  private databank: string; //used in the switch case below to save the name of the exam in JSON vs the UI
  fetchedQuestions: any; //all fetched questions initially
  newQuestion: any; //the new question var from grabbing a new question in the currentTrainingComp
  editedQuestion: any; //the edited question from the currentTrainingComp
  alertIcon: number; //set here to display purple number over need Practical in header
  userName: string; //set from the initial new exam form

  wrongAnswerArray: any = []; //the array to grab the ref of each wrong answer

  verbalsCompleted: any; //holds all verbals and is used for the cards awaiting practical
  allCompletedQCs: any; //holds all fully completed and is used for the data table
  loadDPEReport$: Observable<any>; //a loaded DPE report from the past training component 
  updatedDPE$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }


  /**
   * @param qc 
   * @returns the JSON name of the QC to be used in the getQuestions() call
   */
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
    }
  }

  /**
   * called in the getQuestions() function
   * & sorts questions based on the exam chosen to pull 25 or 50 random questions
 */
  filterQuestions() {
    let randomQuestions = [];
    let randomIndex = 0;
    let randomQuestion = null;
    let numQuestions = 25
    if (this.databank === "FS" || this.databank === "AM" || this.databank === "SC" || this.databank === "DAFPT") {
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

  /**
   * @returns gets the quesitons based in waht table is selected and in the databank var
   */
  getQuestions() {
    this.wrongAnswerArray = [];
    let params = this.databank;
    return this.http.get(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/${params}/${params}.json`).subscribe((response: any) => {
        this.fetchedQuestions = response;
        this.filterQuestions();
      });
  }

  /**
   * 
   * @returns a new single question from the DB
   * used in the currentTrainingComp on the mapped questions
   */
  getNewSingleQuestion() {
    let params = this.databank;
    let rand = Math.floor(Math.random() * this.fetchedQuestions.length);
    return this.http.get(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/${params}/${params}/${rand}.json`).subscribe((response: any) => {
        this.newQuestion = response;
      });
  }

  /**
   * 
   * @param form created from the modal in the currentTrainingComp
   * @returns edits the selected form in the single JSON table on firebase based on the ID
   */
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
   * @param exam 
   * @returns void
   * increments the questions asked as well as correct and wrong answers
   */
  correctQuestion(exam: any) {
    let params = this.databank;
    let id = exam.id - 1;
    return this.http.patch(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/${params}/${params}/${id}.json`, {
      question: exam.question,
      answer: exam.answer,
      ref: exam.ref,
      asked: exam.asked + 1,
      correct: exam.correct + 1,
      wrong: exam.wrong,
      id: exam.id,
    }).subscribe();
  }

  /**
 * @param exam 
 * @returns void
 * increments the questions asked as well as wrong answer
 */
  wrongQuestion(exam: any) {
    let params = this.databank;
    let id = exam.id - 1;
    return this.http.patch(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/${params}/${params}/${id}.json`, {
      question: exam.question,
      answer: exam.answer,
      ref: exam.ref,
      asked: exam.asked + 1,
      correct: exam.correct,
      wrong: exam.wrong + 1,
      id: exam.id,
    }).subscribe();
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
      wrongAnswers: this.wrongAnswerArray,
      verbal: 'GO',
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
      state: 'GO',
      practical: 'GO',
    }).subscribe();
  }

  failPractical(exam: any) {
    return this.http.post(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedQCs.json`, {
      exam: exam,
      state: 'NO-GO',
      practical: 'NO-GO',
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
      state: 'Cancel'
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
      state: 'NO-GO',
      verbal: 'NO-GO',
      wrongAnswers: this.wrongAnswerArray
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
    return this.http.get(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedQCs.json`).subscribe((res: any) => {
        let arr = [];
        for (let key in res) {
          arr.push(res[key]);
        }
        this.allCompletedQCs = arr;
      });
  }

  deleteAllQCs() {
    return this.http.delete(
      `https://qc-database-aee15-default-rtdb.firebaseio.com/completedQCs.json`).subscribe(() => {
        this.getCompletedQCs();
      });
  }

  /**
   * @param exam the exam youve elected to edit in the pastTrainingComp
   * @returns the exam youve selected to edit
   */
  loadDPE(exam: any) {
    this.loadDPEReport$ = exam;
  }

  /**
   * this is called on the MarkDownRenderer to display the selected DPE as an Observable
  */
  updateDPEReport(exam: any) {
    this.loadDPEReport$ = exam;
  }

}