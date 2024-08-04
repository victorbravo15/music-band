/* eslint-disable no-useless-constructor */
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HeaderComponent {
  @Input() showBackButton: boolean = false;
  @Input() showExitButton: boolean = false;
  @Input() isDirector: boolean = false;
  @Input() imageUrl: string = '../../../assets/logo.jpg';

  constructor(private router: Router, private authService: AuthenticationService) { }

  navigateToRoot() {
    this.router.navigateByUrl('/');
  }

  navigateToUserProfile() {
    this.router.navigateByUrl('/users');
  }

  logout() {
    return this.authService.logout();
  }
}
