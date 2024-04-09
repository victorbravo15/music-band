/* eslint-disable no-useless-constructor */
import { CommonModule } from '@angular/common'
import { Component, ViewChild, OnInit } from '@angular/core'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { HeaderComponent } from '../../_components/header/header.component'

import { MatInputModule } from '@angular/material/input'
import { IonicModule } from '@ionic/angular'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { Storage } from '@ionic/storage-angular'
import { Router } from '@angular/router'

@Component({
  standalone: true,
  selector: 'app-instrument-list',
  templateUrl: './instrument-list.page.html',
  styleUrls: ['./instrument-list.page.scss'],
  imports: [CommonModule, HeaderComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    IonicModule,
    MatButtonModule]
})

export class InstrumentListPage implements OnInit {
  constructor (private router: Router, private storage: Storage) {
    this.instrument = ''
    this.storage.get('INSTRUMENT').then((valor) => {
      this.instrument = valor as string
    }).catch((error) => {
      console.error('Ocurrió un error:', error)
      this.router.navigateByUrl('home')
    })
  }

  displayedColumns: string[] = ['name', 'author', 'action']
  // eslint-disable-next-line no-use-before-define
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA)

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  private instrument: string

  ngOnInit () {
    console.log(this.instrument)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  applyFilter (event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  descargarArchivo (element: any): void {
    console.log(element)
    // Obtén el enlace por su identificador
    const enlace = document.getElementById(element.url)
    // Simula un clic en el enlace para iniciar la descarga
    if (enlace) {
      enlace.click()
    }
  }
}

export interface PeriodicElement {
  name: string;
  weight: string;
  url: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Jauchzet Gott in allen Landen, BWV 51', weight: 'Bach Johann Sebastian', url: '../../assets/549236.pdf' },
  { name: 'Trumpet Concerto in Eb for Solo Trumpet & Orchestra', weight: 'Hummel Johann Nepomuk', url: '../../assets/223901.pdf' }
  // ... otros elementos
]
