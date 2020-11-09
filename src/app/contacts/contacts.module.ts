import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactsPageRoutingModule } from './contacts-routing.module';

import { ContactsPage } from './contacts.page';
import {EditComponent} from './components/edit/edit.component';
import {AddComponent} from './components/add/add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactsPageRoutingModule
  ],
    declarations: [ContactsPage, EditComponent, AddComponent]
})
export class ContactsPageModule {}
