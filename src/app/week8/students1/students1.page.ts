import { Component, OnInit } from '@angular/core';
import {Student1} from '../student1.model';
import {Students1Service} from '../students1.service';

@Component({
  selector: 'app-students1',
  templateUrl: './students1.page.html',
  styleUrls: ['./students1.page.scss'],
})
export class Students1Page implements OnInit {
  students: Student1[];
  constructor(private students1Srv: Students1Service) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.students = this.students1Srv.getAllStudents();
  }

}
