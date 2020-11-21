import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact} from '../contact.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ContactsService} from '../contacts.service';
import {AlertController, ToastController} from '@ionic/angular';
import {Observable, Subscription} from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.page.html',
  styleUrls: ['./contact-detail.page.scss'],
})

export class ContactDetailPage implements OnInit, OnDestroy {
  contacts: any;
  tempContacts: any[];
  loadedContact: any;
  i: number;
  private contactsSub: Subscription;

  constructor(
      private activatedRoute: ActivatedRoute,
      private db: AngularFireDatabase,
      private contactsService: ContactsService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('contactId')) { return; }
      const contactId = paramMap.get('contactId');
      console.log(contactId);

      this.db.object('/contact/' + contactId).valueChanges().subscribe(data => {
        console.log('data:', data);
        this.contacts = data;
        console.log('this.contact:', this.contacts);
        const contact = {
          id: this.contacts.key,
          nama: this.contacts.name,
          phone: this.contacts.phoneNumber.split(','),
          email: this.contacts.email.split(',')
        };
        console.log(contact);
        this.loadedContact = contact;
      });

      // week9
      // this.contactsService.getContact(contactId).subscribe(res => {
      //   this.tempContacts = JSON.parse(JSON.stringify(res));
      //   for (this.i = 0; this.i < this.tempContacts.length ; this.i++) {
      //     this.contacts = this.tempContacts[this.i];
      //     const contact = {
      //       id: this.contacts.id,
      //       nama: this.contacts.nama,
      //       phone: this.contacts.phone.split(','),
      //       email: this.contacts.email.split(',')
      //     };
      //     console.log(contact);
      //     this.loadedContact = contact;
      //   }
      // });

      // week8
      // this.tempContacts = this.tempContacts[0];
      // console.log(this.tempContacts);
      // const contact = {
      //   id: this.tempContacts.id,
      //   name: this.tempContacts.nama,
      //   phoneNumber: this.tempContacts.phone,
      //   email: this.tempContacts.email
      // };
      // console.log(contact);
    });
  }

  ngOnDestroy() {
    if (this.contactsSub) {
      this.contactsSub.unsubscribe();
    }
  }

}
