import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})

//most of this comonent will need to be restructured to show the curernt test thats being taken and the progress bar
export class CurrentTrainingComponent implements OnInit {
  @Output() trainingExit = new EventEmitter();
  timerVal: number = 0;
  min: number = 0;
  seconds: number= 0;
  secondTimer: any; 
  minTimer: any;

  constructor(private dialog: MatDialog) { }


  ngOnInit(): void {
    //opens the time is up after 10 min
    setInterval(()=>{
      this.openDialog();
      this.onReset();
    }, 600000);
  }

  onStart(){
    this.secondTimer = setInterval(()=>{
      this.seconds = this.seconds + 1;
      this.timerVal = this.timerVal + 0.1;
      if(this.seconds === 60){
        this.seconds = this.seconds -60;
      }
    }, 1000)  

    this.minTimer = setInterval(()=>{
      this.min = this.min +1;
    }, 60000)
  }

  onStop(){
    clearInterval(this.minTimer);
    clearInterval(this.secondTimer);
    clearInterval(this.timerVal);
    this.openDialog();
  }

  onReset(){
    clearInterval(this.minTimer);
    clearInterval(this.secondTimer);
    clearInterval(this.timerVal);
    this.timerVal = 0;
    this.seconds = 0;
    this.min = 0;
  }

  openDialog(){
    const dialogRef = this.dialog.open(StopTrainingComponent,{
      data: {
        timerVal: this.timerVal
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        this.trainingExit.emit(null);
      }
    })
  }
}
