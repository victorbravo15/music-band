/* eslint-disable no-useless-constructor */
import { CommonModule } from '@angular/common'
import { Component, ViewChild, OnInit } from '@angular/core'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { HeaderComponent } from '../../_components/header/header.component'

import { MatInputModule } from '@angular/material/input'
import { IonicModule, LoadingController } from '@ionic/angular'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { Storage } from '@ionic/storage-angular'
import { Router } from '@angular/router'
import { FileService } from 'src/app/_services/file.service'
import { UtilService } from 'src/app/_services/util.service'
import { AuthenticationService } from 'src/app/_services/authentication.service'

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
  constructor (private router: Router, private storage: Storage, private fileService: FileService, private loadingController: LoadingController, private util: UtilService, private authService: AuthenticationService) {
    this.instrument = ''
    this.storage.get('INSTRUMENT').then((valor) => {
      this.instrument = valor as string
    }).catch((error) => {
      console.error('Ocurrió un error:', error)
      this.router.navigateByUrl('home')
    })
  }

  public uploadAvaliable: boolean = false
  public displayedColumns: string[] = ['name', 'author', 'action']
  // eslint-disable-next-line no-use-before-define
  public dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA)

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  public instrument: string

  async ngOnInit () {
    console.log(this.instrument)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.uploadAvaliable = await this.authService.isRole('DIRECTOR')
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

  async handleUpload (event: any) {
    console.log('hola')
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('instrument', this.instrument)

    const loading = await this.loadingController.create({
      message: 'Subiendo archivo, por favor espere...'
    })
    await loading.present()

    // eslint-disable-next-line no-unused-vars
    const p = new Promise(
      resolve => {
        const r = this.fileService.uploadFile(formData)

        r.subscribe(resp => {
          const dOut = resp
          if (dOut == null) {
            loading.dismiss()
            this.util.showAlertOk('Error', 'Error al crear el comentario')
          } else {
            loading.dismiss()
            this.util.showAlertOk('Creado', 'Comentario creado satisfactoriamente')
          }

          resolve(true)
        },
        () => {
          loading.dismiss()
          resolve(false)
        })
      }
    )
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
