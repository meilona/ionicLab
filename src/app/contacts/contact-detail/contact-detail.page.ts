import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Contact} from '../contact.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ContactsService} from '../contacts.service';
import {AlertController, ToastController} from '@ionic/angular';
import {Observable, Subscription} from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/database';

declare var google: any;

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.page.html',
  styleUrls: ['./contact-detail.page.scss'],
})

export class ContactDetailPage implements OnInit, OnDestroy {
  map: any;
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
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

        const userPos = {
          lat: this.contacts.latitude,
          lng: this.contacts.longitude
        };
        this.showMap(userPos);
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

  showMap(pos: any) {
    const location = new google.maps.LatLng(pos.lat, pos.lng);
    const options = {
      center: location,
      zoom: 13,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    // umnPos: any = {
    //   lat: -6.256081,
    //   lng: 106.618755
    // };
    // The marker, positioned at UMN
    const marker = new google.maps.Marker({
      position: pos,
      map: this.map,
    });
    console.log(pos);
  }

  ngOnDestroy() {
    if (this.contactsSub) {
      this.contactsSub.unsubscribe();
    }
  }

}
