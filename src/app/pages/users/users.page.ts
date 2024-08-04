import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UtilService } from 'src/app/_services/util.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  filteredUsers: any[] = [];
  loading: HTMLIonLoadingElement | undefined;
  constructor(private userService: UserService, public util: UtilService, private router: Router, private loadingController: LoadingController) { }

  searchString: any = '';
  dataSource: MatTableDataSource<any> | undefined;
  displayedColumns: string[] = ['username', 'roles', 'active', 'actions'];
  users: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  async ngOnInit() {
    this.loading = await this.loadingController.create({
      message: 'Cargando usuarios, por favor espere...'
    });
    await this.loading.present();
    this.getUsers();
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;
  }

  applyFilterMobile() {
    const filterValue = this.searchString.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username?.toLowerCase().includes(filterValue) ||
      user.roles?.toLowerCase().includes(filterValue)
    );
  }

  async deleteUser(user: any): Promise<void> {

    (await this.userService.deleteUser(user)).subscribe(
      (response) => {
        this.users = this.users.map(u => {
          if (u.id === user.id) {
            return { ...u, active: !u.active };
          }
          return u;
        });
        if (this.dataSource) {
          this.dataSource.data = this.users;
        }
      },
      (error) => {
        this.util.showAlertOk('Error', 'Error al eliminar el usuario');
      }
    );
  }

  editUser(user: any) {
    this.router.navigateByUrl(`/edit-user/${user.id}`);
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.dataSource) {
      this.dataSource.filter = filterValue;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  async getUsers(): Promise<void> {
    (await this.userService.getUsers()).subscribe(
      (response) => {
        this.users = response as any[];
        this.filteredUsers = this.users;
        if (this.dataSource) {
          this.dataSource.data = this.users;
          this.loading?.dismiss();

        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}
