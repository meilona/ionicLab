import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MahasiswaService {

  constructor(private http: HttpClient) { }

  getAllStudents() {
    return this.http.get('http://192.168.64.3/select.php');
  }

  insertMhs(newMhs: any){
    const mhs = {
      nim: newMhs.nim,
      nama: newMhs.nama,
      prodi: newMhs.prodi,
    };
    const data = JSON.stringify(mhs);
    return this.http.post<any>('http://192.168.64.3/insert.php', data);
  }

  deleteMhs(nim: string){
    const data = JSON.stringify({id: nim});
    return this.http.post<any>('http://192.168.64.3/delete.php', data);
  }
}
