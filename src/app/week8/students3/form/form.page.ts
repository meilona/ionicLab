import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Student1} from '../../student1.model';
import {Router} from '@angular/router';
import {Students3Service} from '../../students3.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  constructor(
      private students3Srv: Students3Service,
      private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log(form);

    const student: Student1 = {
      nim: form.value.nim,
      nama: form.value.nama,
      prodi: form.value.prodi,
    };
    this.students3Srv.addStudent(student);
    this.router.navigateByUrl('week8/students3');
  }
}
