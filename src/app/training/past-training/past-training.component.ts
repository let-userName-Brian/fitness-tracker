import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['date', 'ExamName', 'UserName', 'go/no-go', 'score'];
  dataSource = new MatTableDataSource<any>();

  completedQC: any;

  constructor(private questionService: QuestionsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.questionService.getCompletedQCs();
    setTimeout(() => {
      this.dataSource.data = this.questionService?.allCompletedQCs;
      console.log(this.dataSource.data);
    }, 600);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

