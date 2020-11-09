import {Component, OnDestroy, OnInit} from '@angular/core';
import {Students3Service} from '../students3.service';
import {Student2} from '../student2.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-students3',
  templateUrl: './students3.page.html',
  styleUrls: ['./students3.page.scss'],
})
export class Students3Page implements OnInit, OnDestroy {
  students: Student2[];
  private studentsSub: Subscription;
  constructor(private students3Srv: Students3Service) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.studentsSub = this.students3Srv.getAllStudents().subscribe(students => {
      this.students = students;
    });
  }

  ngOnDestroy() {
    if (this.studentsSub) {
      this.studentsSub.unsubscribe();
    }
  }
}
