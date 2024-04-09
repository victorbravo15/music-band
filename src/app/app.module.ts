import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { IonicModule } from '@ionic/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { IonicStorageModule } from '@ionic/storage-angular'
import { HeaderComponent } from './_components/header/header.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HashLocationStrategy, LocationStrategy } from '@angular/common'
import { CacheInterceptor } from './_services/cache-interceptor'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule, FormsModule, ReactiveFormsModule, IonicStorageModule.forRoot(), HeaderComponent, BrowserAnimationsModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
