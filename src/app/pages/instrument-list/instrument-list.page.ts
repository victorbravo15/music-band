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
import { IDocumentDto } from 'src/app/models/iDocumentDto'

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
    this.docDto = {
      author: '',
      id: 0,
      title: '',
      url: ''
    }
    this.storage.get('INSTRUMENT').then((valor) => {
      this.instrument = valor as string
    }).catch((error) => {
      console.error('Ocurrió un error:', error)
      this.router.navigateByUrl('home')
    })
  }

  public docDto: IDocumentDto
  public uploadAvaliable: boolean = false
  public displayedColumns: string[] = ['title', 'author', 'action']
  // eslint-disable-next-line no-use-before-define
  public dataSource = new MatTableDataSource<IDocumentDto>(ELEMENT_DATA)

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  public instrument: string

  async ngOnInit () {
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

  async printFile (documentDto: IDocumentDto): Promise<void> {
    documentDto.url = 'BOMBARDINO\\223901.pdf'
    const loading = await this.loadingController.create({
      message: 'Descargando archivo, por favor espere...'
    })

    await loading.present()

    // eslint-disable-next-line no-unused-vars
    const p = new Promise(
      resolve => {
        const r = this.fileService.downloadFile(documentDto)

        r.subscribe(resp => {
          const dOut = resp as Blob
          if (dOut == null) {
            loading.dismiss()
            this.util.showAlertOk('Error', 'Error al descargar el documento')
          } else {
            loading.dismiss()
            // Crear una URL del blob
            const pdfUrl = URL.createObjectURL(dOut)

            // Crear un elemento <iframe> para mostrar el PDF
            const iframe = document.createElement('iframe')
            iframe.src = pdfUrl
            iframe.style.display = 'none' // Ocultar el iframe para que no sea visible

            // Agregar el iframe al cuerpo del documento
            document.body.appendChild(iframe)

            // Esperar a que se cargue el PDF antes de imprimirlo
            iframe.onload = function () {
              iframe?.contentWindow?.print() // Imprimir el PDF
            }
            this.util.showAlertOk('Correcto', 'Archivo impreso correctamente')
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

  async handleUpload (event: any) {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('instrument', this.instrument)
    formData.append('docDto', JSON.stringify(this.docDto))

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
            this.util.showAlertOk('Error', 'Error al subir el archivo')
          } else {
            loading.dismiss()
            this.util.showAlertOk('Creado', 'Archivo subido satisfactoriamente')
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

const ELEMENT_DATA: IDocumentDto[] = [
  { title: 'Jauchzet Gott in allen Landen, BWV 51', author: 'Bach Johann Sebastian', url: '../../assets/549236.pdf', id: 0 },
  { title: 'Trumpet Concerto in Eb for Solo Trumpet & Orchestra', author: 'Hummel Johann Nepomuk', url: '../../assets/223901.pdf', id: 0 }
  // ... otros elementos
]
