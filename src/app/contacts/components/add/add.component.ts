import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LoadingController, ModalController, NavController, Platform, ToastController} from '@ionic/angular';
import {ContactsService} from '../../contacts.service';
import {Router} from '@angular/router';
import {Contact} from '../../contact.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {Camera, CameraResultType, CameraSource, Capacitor} from '@capacitor/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  @Input() selectedContact: string;
  contacts: Contact[];
  private contactsSub: Subscription;
  private i: number;
  lat: any;
  long: any;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  @ViewChild('form') formT: NgForm;

  constructor(
      private modalCtrl: ModalController,
      private loadingCtrl: LoadingController,
      private toastController: ToastController,
      private contactsService: ContactsService,
      private router: Router,
      private platform: Platform,
      private sanitizer: DomSanitizer,
      private storage: AngularFireStorage
  ) {
    // const ref = this.storage.ref('photos/' + name + '.jpg');
    // ref.getDownloadURL().subscribe(res => {
    //   console.log('res', res);
    //   this.photo = res;
    // });
  }

  ngOnInit() {
    if ((this.platform.is('mobile') && this.platform.is('hybrid')) ||
        this.platform.is('desktop')){
      this.isDesktop = true;
    }
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
      const name = form.value.name.trim();
      console.log(name);
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

      this.upload(name);
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
