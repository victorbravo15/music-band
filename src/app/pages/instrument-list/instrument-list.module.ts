import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { InstrumentListPageRoutingModule } from './instrument-list-routing.module'

import { InstrumentListPage } from './instrument-list.page'
import { HeaderComponent } from '../../_components/header/header.component'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstrumentListPageRoutingModule,
    HeaderComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    CommonModule,
    InstrumentListPage,
    MatButtonModule,
    MatIconModule
  ],
  declarations: []
})
export class InstrumentListPageModule {}
