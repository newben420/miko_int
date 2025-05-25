import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, Event, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './services/theme.service';
import { PreloaderService } from './services/preloader.service';
import { StorageService } from './services/storage.service';
import { LOCALES } from './locales';
import { Subscription } from 'rxjs';
import { PartialModule } from './partial/partial.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PartialModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  subs!: Subscription;
  constructor(
    private translate: TranslateService,
    private theme: ThemeService,
    private store: StorageService,
    private prel: PreloaderService,
    private _router: Router,
  ) {
    theme.loadSet();
    this.translate.addLangs(LOCALES);
    let loc = store.get("locale");
    if (loc && translate.getLangs().indexOf(loc) !== -1) {
      this.translate.use(loc);
    }
    else {
      this.translate.use(LOCALES[0]);
    }
  }

  ngOnInit() {
    this.prel.hide();
    this.subs = this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.prel.show();
      }
      else if (event instanceof NavigationEnd) {
        this.prel.hide();
      }
      else if (event instanceof NavigationCancel) {
        this.prel.hide();
      }
      else if (event instanceof NavigationError) {
        this.prel.hide();
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
