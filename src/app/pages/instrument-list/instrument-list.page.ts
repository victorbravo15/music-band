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
  constructor (private storage: Storage, private fileService: FileService, private loadingController: LoadingController, public util: UtilService, private authService: AuthenticationService) {
  }

  public searchString: string = ''
  public documentDto: IDocumentDto[] = []
  public docDto!: IDocumentDto
  public uploadAvaliable: boolean = false
  public displayedColumns: string[] = ['title', 'author', 'type', 'print']
  public typeList: string[] = ['Procesiones', 'Pasacalles', 'Pasodobles', 'Concierto clásico', 'Concierto moderno', 'Disney', 'Nuevas para montar', 'Misas', 'Charanga y cachondeo']
  public dataSource!: MatTableDataSource<IDocumentDto>
  public docDtos: { title: string, author: string, type: string, file: File }[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  public instrument!: string
  private originalDocumentDto: IDocumentDto[] = []

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
    await this.getDocumentList()
    this.addNewUpload()
  }

  applyFilter (event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  applyFilterMobile () {
    const filterValue = this.searchString.trim().toLowerCase() // Remove whitespace and convert to lowercase for better search results
    const filterData = this.originalDocumentDto.filter(doc =>
      doc.title.toLowerCase().includes(filterValue) ||
      doc.author.toLowerCase().includes(filterValue) ||
      doc.type.toLowerCase().includes(filterValue)
    )
    this.documentDto = [...filterData]
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

  handleUpload (event: any, index: number) {
    const file: File = event.target.files[0]
    this.docDtos[index].file = file
  }

  addNewUpload () {
    this.docDtos.push({
      title: '',
      author: '',
      type: '',
      file: new File([], '')
    })
  }

  deleteNewUpload () {
    this.docDtos.pop()
  }

  canUpload (): boolean {
    if (!this.docDtos.every(doc => doc.file != null && doc.file.size > 0)) {
      return false
    }
    return true
  }

  async clickUpload () {
    if (!this.canUpload()) {
      this.util.showAlertOk('Error', 'Debe seleccionar un archivo para subir')
      return
    }
    for (const doc of this.docDtos) {
      const formData = new FormData()
      formData.append('file', doc.file)
      formData.append('instrument', this.instrument)
      this.docDto.title = doc.title
      this.docDto.author = doc.author
      this.docDto.type = doc.type
      this.docDto.instrument = this.instrument
      formData.append('docDto', JSON.stringify(this.docDto))

      const loading = await this.loadingController.create({
        message: 'Subiendo archivo, por favor espere...'
      })
      await loading.present()

      try {
        const resp = await this.fileService.uploadFile(formData).toPromise()

        if (resp == null) {
          this.util.showAlertOk('Error', 'Error al subir el archivo ' + doc.file.name)
        } else {
          this.util.showAlertOk('Creado', 'Archivo subido satisfactoriamente ' + doc.file.name)
        }
      } catch (error) {
        this.util.showAlertOk('Error', 'Error al subir el archivo ' + doc.file.name)
      } finally {
        loading.dismiss()
      }
    }
    this.docDtos = []
    this.addNewUpload()
    this.getDocumentList()
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
          this.documentDto = dOut
          this.originalDocumentDto = [...this.documentDto]
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

  async editDocumentType (element: IDocumentDto) {
    const loading = await this.loadingController.create({
      message: 'Editando documento, por favor espere...'
    })
    await loading.present()

    // eslint-disable-next-line no-unused-vars
    const p = new Promise(
      resolve => {
        const r = this.fileService.editDocumentListType(element)

        r.subscribe(resp => {
          const dOut = resp as boolean
          if (dOut) {
            loading.dismiss()
            this.util.showAlertOk('Correcto', 'Tipo del documento editado correctamente')
          } else {
            loading.dismiss()
            this.util.showAlertOk('Error', 'Error al editar el documento')
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
