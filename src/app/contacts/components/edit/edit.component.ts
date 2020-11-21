import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Contact} from '../../contact.model';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {ContactsService} from '../../contacts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  @Input() selectedContact: string;
  // loadedContact: Contact;
  loadedContact: any;
  private contactsSub: Subscription;
  private i: number;

  @ViewChild('form', null) form: NgForm;

  constructor(
      private activatedRoute: ActivatedRoute,
      private modalCtrl: ModalController,
      private loadingCtrl: LoadingController,
      private toastController: ToastController,
      private contactsService: ContactsService,
      private db: AngularFireDatabase,
      private router: Router
  ) { }

  ngOnInit() {
    // this.contactsSub = this.contactsService.getContact(this.selectedContact).subscribe(contacts => {
    //   this.loadedContact = contacts;
    // });
    // this.contactsService.getContact(this.selectedContact).subscribe((res) => {
    //   this.loadedContact = res;
    //   console.log(res);
    // });

    this.db.object('/contact/' + this.selectedContact).valueChanges().subscribe(data => {
      console.log('data:', data);
      this.loadedContact = data;
      console.log('this.mahasiswa:', this.loadedContact);
    });

    // Set Form Value
    setTimeout(() => {
      this.form.setValue(this.loadedContact);
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'New contact added.',
      color: 'success',
      duration: 2000
    });
    await toast.present();
  }

  onSubmit(form: NgForm) {
    console.log(form);

    this.presentLoading().then(() => {
      this.contactsService.updateContact(this.selectedContact, form.value).then(res => {
        console.log(res);
        this.router.navigateByUrl('/contacts');
      }).catch(error => console.log(error));

      form.reset();
      this.modalCtrl.dismiss( 'success', 'confirm');
      this.presentToast();
    });
  }

  onCancel(){
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Saving contact...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed');
  }

  filteredData(splittedData){
    const tempArr = [];
    for (this.i = 0; this.i < splittedData.length; this.i++) {
      const now = splittedData[this.i].trim();
      if (now !== undefined && now !== '') {
        tempArr.push(splittedData[this.i]);
      }
    }
    return tempArr;
  }

  // onSubmit(form: NgForm) {
  //   const id = this.loadedContact[0].id;
  //   const name = form.value.name;
  //   const email = form.value.email;
  //   const phoneNumber = form.value.phoneNumber;
  //
  //   if (!form.valid) {
  //     return;
  //   }
  //   this.presentLoading().then(() => {
  //     // if (typeof email === 'string'){
  //     //   email = email.split(',');
  //     //   email = this.filteredData(email);
  //     //   if (typeof phoneNumber === 'string'){
  //     //     phoneNumber = phoneNumber.split(',');
  //     //     phoneNumber = this.filteredData(phoneNumber);
  //     //     this.sendEdittedData(id, name, email, phoneNumber);
  //     //   } else {
  //     //     this.sendEdittedData(id, name, email, phoneNumber);
  //     //   }
  //     // } else if (typeof phoneNumber === 'string') {
  //     //   phoneNumber = phoneNumber.split(',');
  //     //   phoneNumber = this.filteredData(phoneNumber);
  //     //   this.sendEdittedData(id, name, email, phoneNumber);
  //     // } else {
  //       this.sendEdittedData(id, name, email, phoneNumber);
  //     // }
  //   });
  // }

  // sendEdittedData(id: any, name: string, email: any, phoneNumber: any){
  //   // const contact: Contact = {
  //   //   id,
  //   //   name,
  //   //   email,
  //   //   phoneNumber
  //   // };
  //   const contact = {
  //     id,
  //     name,
  //     phoneNumber,
  //     email
  //   };
  //   // this.contactsService.editContact(contact).subscribe(res => {
  //   //   console.log(res);
  //   // });
  //   this.modalCtrl.dismiss( 'success', 'confirm');
  //   this.router.navigate(['/contacts']);
  //   this.presentToast();
  // }

}
