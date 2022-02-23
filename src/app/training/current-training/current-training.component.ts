import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseService } from '../exercise.service';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})

//most of this comonent will need to be restructured to show the curernt test thats being taken and the progress bar
export class CurrentTrainingComponent implements OnInit {
  @Output() trainingExit = new EventEmitter();
  progress = 0;
  timer: any;

  constructor(private dialog: MatDialog, private exerciseService: ExerciseService) { }

  ngOnInit(): void {
    this.onStart();
  }

  onStart() {
    const step = this.exerciseService.getRunningExercise().duration / 95 * 1000;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        this.progress = 0;
      }
    }, step);
  }

  onStop() {
    clearInterval(this.timer);
    this.openDialog();
  }

  onReset() {
    clearInterval(this.timer);
    this.progress = 0;
  }

  openDialog() {
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.trainingExit.emit(null);
      }
    })
  }
}
