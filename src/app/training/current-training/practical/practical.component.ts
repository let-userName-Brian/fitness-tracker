import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExerciseService } from '../../exercise.service';

@Component({
  selector: 'app-practical',
  templateUrl: './practical.component.html',
  styleUrls: ['./practical.component.css']
})
export class PracticalComponent implements OnInit {
  verbalCompletedQCs: any;
  verbals: any;
  private verbalQCsComplete: Subscription;
  constructor(private exerciseService: ExerciseService) { }

  ngOnInit(): void {
    this.verbalQCsComplete = this.exerciseService.verbalsChanged.subscribe((qcs: any) => {
      this.verbalCompletedQCs = qcs;
    });
    this.exerciseService.fetchVerbalQCCompleted();
    this.verbals = this.exerciseService.verbalDone;
  }

}
