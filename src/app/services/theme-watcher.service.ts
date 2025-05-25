import { AfterViewInit, Injectable, NgZone, OnDestroy } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ThemeWatcherService implements AfterViewInit, OnDestroy {
  private observer!: MutationObserver;
  private callback!: (isDark: boolean) => void;

  // Store current theme state
  private isDark = false;

  constructor(private zone: NgZone) {}

  watch(callback: (isDark: boolean) => void) {
    this.callback = callback;

    this.zone.runOutsideAngular(() => {
      this.observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes') {
            const dark = document.body.classList.contains('darkMode');
            if (this.isDark !== dark) {
              this.isDark = dark;
              this.zone.run(() => this.callback(this.isDark));
            }
          }
        }
      });

      this.observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    });
  }

  getCurrentTheme(): boolean {
    this.isDark = document.body.classList.contains('darkMode');
    return this.isDark;
  }

  ngAfterViewInit(): void {
    this.isDark = document.body.classList.contains('darkMode');
    this.callback?.(this.isDark);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
