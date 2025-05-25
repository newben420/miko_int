import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../partial/alert/alert.component';
import { LocaleService } from './locale.service';

type AlertType = 'success' | 'error' | 'warning' | "alert";

class Opts {
  tr?: any;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private snackbar: MatSnackBar,
    private locale: LocaleService,
  ) { }

  private typeMap = {
    "success": "success",
    "error": "danger",
    "warning": "warning",
    "alert": "alert"
  };

  show(
    type: AlertType,
    message: string,
    opts: Opts = {}
  ) {
    if(message){
      const {tr, duration} = opts;
    this.locale.conv([message], r => {
      this.snackbar.openFromComponent(AlertComponent, {
        data: { type: this.typeMap[type], message: r[0], opts },
        duration: duration || import.meta.env["NG_APP_ALERT_DURATION"],
        horizontalPosition: "end",
        verticalPosition: "top",
      })
    }, tr || {});
    }
  }
}
