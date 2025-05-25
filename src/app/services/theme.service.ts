import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private key: string = "theme";

  private dark = new BehaviorSubject<boolean>(false);
  darkEvent = this.dark.asObservable();

  constructor(
    private store: StorageService,
  ) { }

  loadSet(){
    let s = this.store.get(this.key);
    if(s === "dark"){
      this.dark.next(true);
    }
    else{
      this.dark.next(false);
    }
    if(this.dark.value){
      document.body.classList.add("darkMode");
    }
    else{
      document.body.classList.remove("darkMode");
    }
  }

  setTheme(){
    const newValue = this.dark.value ? "light" : "dark";
    this.store.set(this.key, newValue);
    this.loadSet();
  }
}
