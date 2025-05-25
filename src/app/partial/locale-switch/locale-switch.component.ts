import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { LocaleService } from '../../services/locale.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-locale-switch',
  standalone: false,
  templateUrl: './locale-switch.component.html',
  styleUrl: './locale-switch.component.scss'
})
export class LocaleSwitchComponent {
  private locale = inject(TranslateService);
  private loc = inject(LocaleService);
  l: string =  this.locale.currentLang;
  lang: Subscription = this.locale.onLangChange.subscribe(x => {
    this.l = x.lang;
  });

  ngOnDestroy(){
    this.lang.unsubscribe();
  }

  openLangs(){
    this.loc.toggleShown();
  }
}
