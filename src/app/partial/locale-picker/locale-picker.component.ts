import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from '../../services/locale.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-locale-picker',
  standalone: false,
  templateUrl: './locale-picker.component.html',
  styleUrl: './locale-picker.component.scss'
})
export class LocalePickerComponent {
  shown: boolean = false;
  shownSub: Subscription | null = null;
  locales: string[] = [];
  lang: string = "";

  constructor(
    private locale: TranslateService,
    private loc: LocaleService,
  ) {
    this.locales = locale.getLangs();
    this.shownSub = loc.shownEvent.subscribe(x => {
      this.shown = x;
    });
  }

  setLocale(l: string) {
    this.loc.setLocale(l);
    this.loc.toggleShown();
  }

  close() {
    this.loc.toggleShown();
  }
}
