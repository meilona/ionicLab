import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContactsService} from './contacts.service';
import {AlertController, IonItemSliding, ModalController, NavController, ToastController} from '@ionic/angular';
import {Contact} from './contact.model';
import {EditComponent} from './components/edit/edit.component';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AddComponent} from './components/add/add.component';
import {map} from 'rxjs/operators';
import {AuthService} from './services/auth.service';

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
  login = 0;

  constructor(
      private contactsService: ContactsService,
      private modalCtrl: ModalController,
      private alertCtrl: AlertController,
      private router: Router,
      private authService: AuthService,
      private navCtrl: NavController,
      private toastController: ToastController
  ) { }

  ngOnInit() {}

  // ngOnDestroy() {
  //   if (this.contactsSub) {
  //     this.contactsSub.unsubscribe();
  //   }
  // }

  ionViewWillEnter(){

    // get user or guest
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        console.log(res.email);
        this.login = 1;
      } else {
        console.log(this.login);
      }
    }, err => {
      console.log('err', err);
    });

    // get all contact list
    this.contactsService.getAllContacts().snapshotChanges().pipe(
          map(changes =>
          changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
          )
    ).subscribe(data => {
      this.contacts = [ ];
      // this.contacts = data;
      this.tempContacts = data;
      for (this.i = 0; this.i < this.tempContacts.length ; this.i++) {
        this.loadedContacts = this.tempContacts[this.i];
        console.log(this.loadedContacts);
        const contact = {
          id: this.loadedContacts.key,
          nama: this.loadedContacts.name,
          phone: this.loadedContacts.phoneNumber.split(','),
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
    if (this.login === 1){
      const modal = await this.modalCtrl.create({
        component: AddComponent,
        componentProps: {selectedContact: this.contacts}
      });

      modal.onDidDismiss().then(resultData => {
        console.log(resultData.data, resultData.role);
        this.ionViewWillEnter();
      });

      return await modal.present();
    } else {
      this.loginAlert('add');
    }
  }

  edit($event, contactId, slidingItem: IonItemSliding) {
    slidingItem.close();
    if (this.login === 1){
      console.log(contactId, 'edited');
      this.editModal(contactId);
    } else {
      this.loginAlert('edit');
    }
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

  async presentAlert(event, contactId, slidingItem: IonItemSliding) {
    slidingItem.close();
    if (this.login === 1){
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
    } else {
      this.loginAlert('delete');
    }
  }

  async loginAlert(choice) {
    const alert = await this.alertCtrl.create({
      header: 'You have to Login',
      message: 'Please login first to ' + choice + ' contact',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Login',
          handler:  () => this.navCtrl.navigateForward('/contacts/login')
        }
      ]
    });

    await  alert.present();
  }

  deleteContact(event, contactId) {
    console.log(contactId);
    // this.contactsService.deleteContact(contactId).subscribe(res => {
    //   console.log(res);
    // });
    this.contactsService.deleteContact(contactId).then(res => {
      console.log(res);
    });
    this.router.navigate(['/contacts']);
    this.presentToast();
  }

  logout(){
    this.authService.logoutUser()
        .then(res => {
          console.log(res);
          this.login = 0;
          this.ionViewWillEnter();
        })
        .catch(error => {
          console.log(error);
        });
  }

}
