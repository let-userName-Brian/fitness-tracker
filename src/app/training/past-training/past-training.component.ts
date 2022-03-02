import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExerciseService } from '../exercise.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Exercise } from '../exercise.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['date', 'ExamName', 'UserName', 'go/no-go'];
  dataSource = new MatTableDataSource<any>();
  private qcChangedSubscrption: Subscription;
  constructor(private excerciseService: ExerciseService, private authService: AuthService) { }

  ngOnInit(): void {
    this.qcChangedSubscrption = this.excerciseService.finishedQCsChanged.subscribe((qcs: Exercise[]) => {
      this.dataSource.data = qcs;
    });
    this.excerciseService.fetchCompletedOrCancelledExercises();
  }

  ngOnDestroy() {
    this.qcChangedSubscrption.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

