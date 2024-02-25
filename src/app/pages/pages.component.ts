import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';
import { UpdateProfileService } from '../services/update-profile.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  public loggedUser!: User;
  public sideNavMenu!: any;

  constructor(
    private authService: AuthService,
    public updateProfileService: UpdateProfileService,
    public ui: UiService
  ) {}
  ngOnInit(): void {
    this.loggedUser = this.authService.currentUserLogged;
    this.sideNavMenu = this.authService.currentSideNav;
  }

  logout() {
    this.authService.logout();
  }

  toggleSideNave() {
    if (this.ui.isSideBarOpen) {
      this.ui.closeSideBar();
    } else {
      this.ui.openSideBar();
    }
  }
}
