import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Week8PageRoutingModule } from './week8-routing.module';

import { Week8Page } from './week8.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Week8PageRoutingModule
  ],
  declarations: [Week8Page]
})
export class Week8PageModule {}
