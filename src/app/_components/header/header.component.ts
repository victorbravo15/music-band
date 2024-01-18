/* eslint-disable no-useless-constructor */
import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { IonicModule } from '@ionic/angular'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class HeaderComponent {
  @Input() showBackButton: boolean = false
  @Input() imageUrl: string = '../../../assets/logo.jpg'

  constructor (private router: Router) {}

  navigateToRoot () {
    this.router.navigateByUrl('/')
  }
}
