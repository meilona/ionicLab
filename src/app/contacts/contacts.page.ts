import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContactsService} from './contacts.service';
import {AlertController, IonItemSliding, ModalController, ToastController} from '@ionic/angular';
import {Contact} from './contact.model';
import {EditComponent} from './components/edit/edit.component';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AddComponent} from './components/add/add.component';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  // contacts: Contact[];
  contacts: any[];
  tempContacts: any[];
  loadedContacts: any;
  i: number;

  constructor(
      private contactsService: ContactsService,
      private modalCtrl: ModalController,
      private alertCtrl: AlertController,
      private router: Router,
      private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  // ngOnDestroy() {
  //   if (this.contactsSub) {
  //     this.contactsSub.unsubscribe();
  //   }
  // }

  ionViewWillEnter(){
    this.contactsService.getAllContacts().subscribe((res) => {
      this.contacts = [ ];
      this.tempContacts = JSON.parse(JSON.stringify(res));
      for (this.i = 0; this.i < this.tempContacts.length ; this.i++) {
        this.loadedContacts = this.tempContacts[this.i];
        const contact = {
          id: this.loadedContacts.id,
          nama: this.loadedContacts.nama,
          phone: this.loadedContacts.phone.split(','),
          email: this.loadedContacts.email.split(',')
        };
        console.log(contact);
        this.contacts.push(contact);
      }
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Kontak dihapus',
      duration: 2000,
      color: 'warning'
    });

    await toast.present();
  }

  onFilterUpdate(event: CustomEvent) {
    console.log(event.detail);
  }

  async add() {
    const modal = await this.modalCtrl.create({
      component: AddComponent,
      componentProps: {selectedContact: this.contacts}
    });

    modal.onDidDismiss().then(resultData => {
      console.log(resultData.data, resultData.role);
      this.ionViewWillEnter();
    });

    return await modal.present();
  }

  edit($event, contactId, slidingItem: IonItemSliding) {
    slidingItem.close();
    console.log(contactId, 'edited');
    this.editModal(contactId);
  }

  async presentAlert(event, contactId, slidingItem: IonItemSliding) {
    slidingItem.close();
    const alert = await this.alertCtrl.create({
      header: 'Hapus Kontak',
      message: 'Apakah yakin ingin menghapus? Jika sudah dihapus, tidak bisa dikembalikan lagi.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          handler:  () => this.deleteContact(event, contactId)
        }
      ]
    });
    await  alert.present();
  }

  deleteContact( event, contactId) {
    console.log(contactId);
    this.contactsService.deleteContact(contactId).subscribe(res => {
      console.log(res);
    });
    this.ionViewWillEnter();
    this.router.navigate(['/contacts']).then(() => {
      this.presentToast();
    });
  }

  async editModal(contactId) {
    const modal = await this.modalCtrl.create({
      component: EditComponent,
      componentProps: { selectedContact: contactId }
    });

    modal.onDidDismiss().then(resultData => {
      console.log(resultData.data, resultData.role);
      this.ionViewWillEnter();
    });

    return await modal.present();
  }

}
