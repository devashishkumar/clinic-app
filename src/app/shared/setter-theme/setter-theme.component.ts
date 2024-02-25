import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-setter-theme',
  templateUrl: './setter-theme.component.html',
  styles: [
  ]
})
export class SetterThemeComponent {
  darkMode!: string | null;
  constructor( public ui: UiService){}
  ngOnInit() {
    this.darkMode = localStorage.getItem("theme");
    if (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) { this.darkMode = 'dark' } 
  }

  toggleDarkMode() { 
    this.ui.setTheme();
    this.darkMode = localStorage.getItem("theme");
  }
}
