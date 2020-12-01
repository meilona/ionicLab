import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {ContactsService} from '../../contacts.service';
import {Router} from '@angular/router';
import {Contact} from '../../contact.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  @Input() selectedContact: string;
  contacts: Contact[];
  private contactsSub: Subscription;
  private i: number;
  lat: any;
  long: any;

  @ViewChild('form') formT: NgForm;

  constructor(
      private modalCtrl: ModalController,
      private loadingCtrl: LoadingController,
      private toastController: ToastController,
      private contactsService: ContactsService,
      private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getCurrentLoc();
  }

  onCancel(){
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'New contact added.',
      color: 'success',
      duration: 2000
    });
    await toast.present();
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

  // idData() {
  //   this.contactsSub = this.contactsService.getAllContacts().subscribe(contacts => {
  //     this.contacts = contacts;
  //   });
  //   for (this.i = 0; this.i < this.contacts.length; this.i++) {
  //     const tempId = Math.floor((Math.random() * 1000) + 1);
  //     const curId = parseInt(this.contacts[this.i].id, 100);
  //     if (tempId !== curId){
  //       return tempId;
  //     }
  //   }
  // }

  getCurrentLoc() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        console.log(this.lat);
        console.log(this.long);
        this.formT.control.get('latitude').patchValue(this.lat);
        this.formT.control.get('longitude').patchValue(this.long);
      });
    }
  }

  onSubmit(form: NgForm) {
    console.log(form);
    // const newId = this.idData();
    if (!form.valid) {
      return;
    }
    this.presentLoading().then(() => {
      // const id = newId.toString();
      // const name = form.value.name;
      // const email = form.value.email;
      // const phoneNumber = form.value.phoneNumber;
      // let email = (form.value.email).split(',');
      // let phoneNumber = (form.value.phoneNumber).split(',');
      // email = this.filteredData(email);
      // phoneNumber = this.filteredData(phoneNumber);
      // const contact: Contact = {
      //   id,
      //   name,
      //   email,
      //   phoneNumber,
      // };
      // this.contactsService.insertContact(contact);
      // const contact = {
      //   nama: name,
      //   phone: phoneNumber,
      //   email
      // };

      this.contactsService.createContact(form.value).then(res => {
        console.log(res);
        this.router.navigateByUrl('/contacts');
      }).catch(error => console.log(error));

      // this.contactsService.createContact(contact).subscribe(res => {
      //   console.log(res);
      // });
      this.modalCtrl.dismiss( 'success', 'confirm');
      // this.router.navigate(['/contacts']);
      this.presentToast();
    });
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
}
