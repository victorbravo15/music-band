import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import { HeaderComponent } from "../../_components/header/header.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { InstrumentListPageRoutingModule } from '../instrument-list/instrument-list-routing.module';
import { InstrumentListPage } from '../instrument-list/instrument-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule,
    HeaderComponent,
    InstrumentListPageRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    InstrumentListPage,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [UsersPage]
})
export class UsersPageModule { }
