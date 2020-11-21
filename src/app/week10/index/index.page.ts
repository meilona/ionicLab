import { Component, OnInit } from '@angular/core';
import {MahasiswaService} from '../mahasiswa.service';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  mahasiswa: any;
  constructor(private mhsSrv: MahasiswaService,
              private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.mhsSrv.getAll().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
        )
    ).subscribe(data => {
      this.mahasiswa = data;
      console.log(data);
    });
  }

  delete(event, key) {
    console.log(key);
    this.mhsSrv.delete(key).then(res => {
      console.log(res);
    });
    this.router.navigate(['/']);
  }

}
