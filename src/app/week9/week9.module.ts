import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Week9PageRoutingModule } from './week9-routing.module';

import { Week9Page } from './week9.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Week9PageRoutingModule
  ],
  declarations: [Week9Page]
})
export class Week9PageModule {}
