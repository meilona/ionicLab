import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Contact} from '../../contact.model';
import {LoadingController, ModalController, Platform, ToastController} from '@ionic/angular';
import {ContactsService} from '../../contacts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/database';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {AngularFireStorage} from '@angular/fire/storage';
import {Camera, CameraResultType, CameraSource, Capacitor} from '@capacitor/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  @Input() selectedContact: string;
  // loadedContact: Contact;
  loadedContact: any;
  private contactsSub: Subscription;
  private i: number;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  @ViewChild('form', null) form: NgForm;

  constructor(
      private activatedRoute: ActivatedRoute,
      private modalCtrl: ModalController,
      private loadingCtrl: LoadingController,
      private toastController: ToastController,
      private contactsService: ContactsService,
      private db: AngularFireDatabase,
      private router: Router,
      private platform: Platform,
      private sanitizer: DomSanitizer,
      private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    if ((this.platform.is('mobile') && this.platform.is('hybrid')) ||
        this.platform.is('desktop')){
      this.isDesktop = true;
    }

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

      const ref = this.storage.ref('photos/' + this.loadedContact.name + '.jpg');
      ref.getDownloadURL().subscribe(res => {
        console.log('res', res);
        this.photo = res;
      });
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

      this.upload(form.value.name);

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

  async getPicture(type: string){
    if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')){
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      saveToGallery: true
    });
    console.log(image);
    this.photo = image.dataUrl;
    // this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    console.log('this.photo: ', this.photo);
  }

  onFileChoose(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)){
      console.log('File Format not supported');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  upload(name) {
    const file = this.dataURLtoFile(this.photo, 'file');
    console.log('file:', file);
    const filepath = 'photos/' + name + '.jpg';
    const ref = this.storage.ref(filepath);
    const task = ref.put(file);
  }

  dataURLtoFile(dataurl, filename) {

    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  }
}
