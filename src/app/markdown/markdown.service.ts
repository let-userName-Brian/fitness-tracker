import { Injectable } from "@angular/core";
import { QuestionsService } from "../training/questions.service";

@Injectable({ providedIn: "root" })
export class MarkDownService {
  loadedDPE = this.questionService.loadDPEReport;

  constructor(private questionService: QuestionsService) {}

 
}