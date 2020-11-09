import {Injectable} from '@angular/core';
import {Contact} from './contact.model';
import {map, take} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  // private contacts = new BehaviorSubject<Contact[]>([
  //   new Contact('1', 'John Thor', ['081122334455', '081234567890'], ['john.thor@umn.ac.id', 'hello@johnthor.com'] ),
  //   new Contact('2', 'John Wick', ['087812312300', '081512131415', '088899552151'], ['john.wick@umn.ac.id', 'john.wick@gmail.com'])
  // ]);
  constructor(private http: HttpClient) { }

  getAllContacts() {
    return this.http.get('http://192.168.64.3/select_all_kontak.php');
  }

  getContact(id: string) {
    const data = JSON.stringify({id});
    return this.http.post<any>('http://192.168.64.3/select_kontak.php', data);
  }

  insertContact(newContact: any){
    const contact = {
      id: newContact.id,
      nama: newContact.nama,
      phone: newContact.phone,
      email: newContact.email,
    };
    const data = JSON.stringify(contact);
    return this.http.post<any>('http://192.168.64.3/insert_kontak.php', data);
  }

  editContact(newContact: any){
    const contact = {
      id: newContact.id,
      nama: newContact.name,
      phone: newContact.phoneNumber,
      email: newContact.email,
    };
    // console.log(contact);
    const data = JSON.stringify(contact);
    return this.http.post<any>('http://192.168.64.3/update_kontak.php', data);
  }

  deleteContact(id: string){
    const data = JSON.stringify({id});
    return this.http.post<any>('http://192.168.64.3/delete_kontak.php', data);
  }

  // getAllContacts(){
  //   return this.contacts.asObservable();
  // }

  // getContact(contactId: string) {
  //   return this.contacts.pipe(
  //       take(1),
  //       map(contacts => {
  //         return {...contacts.find(c => c.id === contactId)};
  //       })
  //   );
  // }

  // addContact(contact: Contact) {
  //   this.getAllContacts().pipe(take(1)).subscribe(contacts => {
  //     this.contacts.next(contacts.concat(contact));
  //   });
  // }

  // editContact(contact: Contact){
  //   console.log(contact.id);
  //   this.deleteContact(contact.id);
  //
  //   this.getAllContacts().pipe(take(1)).subscribe(contacts => {
  //     this.contacts.next(contacts.concat(contact));
  //   });
  // }

  // deleteContact(contactId: string){
  //   const deletedContact: Contact[] = this.contacts.getValue();
  //   deletedContact.forEach((item, index) => {
  //     if (item.id === contactId) {
  //       deletedContact.splice(index, 1);
  //     }
  //   });
  //   this.contacts.next(deletedContact);
  // }
}
