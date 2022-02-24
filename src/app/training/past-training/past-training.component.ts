import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExerciseService } from '../exercise.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit {
  displayedColumns = ['date', 'ExamName', 'UserName', 'passOrFail', 'Eamil'];
  dataSource = new MatTableDataSource<any>();
  constructor(private excerciseService: ExerciseService, private authService: AuthService) { }

  ngOnInit(): void {
    this.dataSource.data = this.excerciseService.getCompletedOrCancelledExercises();
    console.log(this.dataSource.data);
  }

}
