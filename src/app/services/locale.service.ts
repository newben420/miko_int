import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { StorageService } from './storage.service';
import {ResParamFx, StringArrayParamFx } from '@model/functions';
import { GRes } from '@model/res';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {


  shown = new BehaviorSubject<boolean>(false);
  shownEvent = this.shown.asObservable();
  toggleShown(){
    this.shown.next(!this.shown.value);
  }
  constructor(
    private trans: TranslateService,
    private store: StorageService
  ) {
  }

  setLocale(locale: string){
    // this.trans.setTranslation("eb")
    this.trans.use(locale);
    this.store.set("locale", locale);
  }

  private con(key: string, fn: ResParamFx, val: any = {}) {
    let sub: Subscription = this.trans.get(key, val).subscribe((res: string) => {
      if (res == key) {
        fn(GRes.err(res));
      }
      else {
        fn(GRes.succ(res));
      }
      try {
        sub.unsubscribe();
      } catch (error) {

      }
    });
  }

  conv(keys: string[], fn: StringArrayParamFx, val: any = {}){
    let res: string[] = []
    let keysCp: string[] = keys.filter(x => true);
    const runX = (cb: Function) => {
      if(keysCp.length == 0){
        cb();
      }
      else{
        let key: string = keysCp.shift()!;
        this.con(key, r => {
          res.push(r.message);
          runX(cb);
        }, val);
      }
    }
    runX(() => {
      fn(res);
    });
  }
}
