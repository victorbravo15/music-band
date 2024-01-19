import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { InstrumentListPageRoutingModule } from './instrument-list-routing.module'

import { InstrumentListPage } from './instrument-list.page'
import { HeaderComponent } from '../_components/header/header.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstrumentListPageRoutingModule,
    HeaderComponent
  ],
  declarations: [InstrumentListPage]
})
export class InstrumentListPageModule {}
