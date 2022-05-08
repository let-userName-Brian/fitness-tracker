import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { QuestionsService } from '../questions.service';
import { ExcelService } from 'src/app/excel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['date', 'ExamName', 'UserName', 'go/no-go', 'Verbal', 'Practical', 'score', 'generate DPE'];
  dataSource = new MatTableDataSource<any>();
  excelSheet: any = {
    date: '',
    qc: '',
    member: '',
    status: '',
    score: 0
  }

  constructor(
    private questionService: QuestionsService,
    private excelService: ExcelService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.questionService.getCompletedQCs();
    setTimeout(() => {
      this.dataSource.data = this.questionService?.allCompletedQCs;
      this.excelSheet = this.dataSource.data;
      this.flatlistExcelVar()
      console.log(this.dataSource.data);
    }, 600);
  }

  flatlistExcelVar() {
    this.excelSheet?.forEach((element, index) => {
      element.date = this.excelSheet[index].exam.date;
      element.qc = this.excelSheet[index].exam.exam.name;
      element.member = this.excelSheet[index].exam.user;
      element.score = this.excelSheet[index].exam.score;
    });
  }

  onLoadDPE(exam: any) {
    this.questionService.loadDPE(exam);
    this.router.navigate(['/dpe']);
  }

  onDeleteAllDPEs() {
    console.log('delete all DPEs');
    this.questionService.deleteAllQCs();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase();
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.excelSheet, 'QC_Report');
  }
}

