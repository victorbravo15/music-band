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
  }

  public docDto!: IDocumentDto
  public uploadAvaliable: boolean = false
  public displayedColumns: string[] = ['title', 'author', 'type', 'print', 'download']
  public typeList: string[] = ['Procesiones', 'Pasacalles', 'Pasodobles', 'Concierto clásico', 'Concierto moderno', 'Disney', 'Nuevas para montar', 'Misas', 'Charanga y cachondeo']
  public dataSource!: MatTableDataSource<IDocumentDto>
  private file: any

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  public instrument!: string

  async ngOnInit () {
    this.instrument = ''
    this.instrument = await this.storage.get('INSTRUMENT')
    this.docDto = {
      author: '',
      id: 0,
      title: '',
      url: '',
      instrument: this.instrument,
      type: this.typeList[0]
    }
    this.uploadAvaliable = await this.authService.isRole('DIRECTOR')
    if (this.uploadAvaliable) {
      this.displayedColumns.push('delete')
    }
    await this.getDocumentList()
  }

  applyFilter (event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  async printFile (documentDto: IDocumentDto): Promise<void> {
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
          if (!dOut) {
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

  async downloadFile (documentDto: IDocumentDto): Promise<void> {
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
            // Crear una URL del blob
            const url = URL.createObjectURL(dOut)

            // Crear un enlace <a> para descargar el archivo
            const link = document.createElement('a')
            link.href = url
            link.download = 'archivo.pdf' // Nombre del archivo que se descargará
            link.style.display = 'none' // Ocultar el enlace

            // Agregar el enlace al cuerpo del documento
            document.body.appendChild(link)

            // Simular el clic en el enlace para iniciar la descarga
            link.click()

            // Eliminar el enlace después de la descarga
            document.body.removeChild(link)

            // Liberar la URL del blob
            URL.revokeObjectURL(url)

            loading.dismiss()
            this.util.showAlertOk('Correcto', 'Archivo descargado correctamente')
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

  handleUpload (event: any) {
    this.file = event.target.files[0]
  }

  async clickUpload () {
    const formData = new FormData()
    formData.append('file', this.file)
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
            this.getDocumentList()
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

  async clickDelete (document: IDocumentDto) {
    const loading = await this.loadingController.create({
      message: 'Borrando archivo, por favor espere...'
    })
    await loading.present()

    // eslint-disable-next-line no-unused-vars
    const p = new Promise(
      resolve => {
        const r = this.fileService.deleteFile(document)

        r.subscribe(resp => {
          const dOut = resp
          if (dOut == null) {
            loading.dismiss()
            this.util.showAlertOk('Error', 'Error al borrar el archivo')
          } else {
            loading.dismiss()
            this.util.showAlertOk('Correcto', 'Archivo borrado satisfactoriamente')
            this.getDocumentList()
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

  async getDocumentList () {
    const loading = await this.loadingController.create({
      message: 'Cargando archivos, por favor espere...'
    })
    await loading.present()

    // eslint-disable-next-line no-unused-vars
    const p = new Promise(
      resolve => {
        const r = this.fileService.getDocumentList(this.instrument)

        r.subscribe(resp => {
          const dOut = resp as IDocumentDto[]
          if (dOut == null) {
            loading.dismiss()
            this.util.showAlertOk('Error', 'Error al cargar el listado')
          } else {
            this.dataSource = new MatTableDataSource<IDocumentDto>(dOut)
            this.dataSource.paginator = this.paginator
            this.dataSource.sort = this.sort

            loading.dismiss()
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
