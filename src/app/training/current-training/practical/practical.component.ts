import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExerciseService } from '../../exercise.service';

@Component({
  selector: 'app-practical',
  templateUrl: './practical.component.html',
  styleUrls: ['./practical.component.css']
})
export class PracticalComponent implements OnInit, OnDestroy {
  verbalCompletedQCs: any;
  
  private verbalQCsComplete: Subscription;
  constructor(private exerciseService: ExerciseService) { }


  ngOnInit(){
    console.log('practical component', this.verbalCompletedQCs)
    this.verbalQCsComplete = this.exerciseService.verbalsChanged.subscribe((qcs: any) => {
      this.verbalCompletedQCs = qcs;
    });
    this.exerciseService.fetchVerbalQCCompleted();
  }

  ngOnDestroy(){
    this.verbalQCsComplete.unsubscribe();
  }
}
