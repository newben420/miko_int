import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  standalone: false,
  styleUrl: './theme-switch.component.scss'
})
export class ThemeSwitchComponent {
  dark: boolean = false;
  sub!: Subscription;

  constructor(
    private theme: ThemeService,
  ){
    this.sub = theme.darkEvent.subscribe(x => {
      this.dark = x;
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  setTheme(){
    this.theme.setTheme();
  }
}
