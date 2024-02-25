import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  public darkMode!: string | null;
  public isSideBarOpen: boolean = false;
  public userType!: string | null

  constructor() {

    this.darkMode = localStorage.getItem('theme');
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      if (!localStorage.getItem('theme')) { this.darkMode = 'dark'; }
    } else {
      document.documentElement.classList.remove('dark');
      if (!localStorage.getItem('theme')) { this.darkMode = 'light'; }
    }
  }


  setTheme() {
    (document.documentElement.classList.toggle('dark'))
      ? localStorage.setItem('theme', 'dark')
      : localStorage.setItem('theme', 'light')
    this.darkMode = localStorage.getItem('theme');
  }


  openSideBar() {
    this.isSideBarOpen = true;
  }

  closeSideBar() {
    this.isSideBarOpen = false;
  }

  get currentUserToEnrrolled() {
    return this.userType
  }

  currentUserType(type: string) {
    if (type) {
      this.userType = type;
    } else {
      this.userType = '';
    }
  }

}