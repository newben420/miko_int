import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { PartialModule } from '../partial.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    NgbAlertModule, PartialModule, CommonModule,
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, private _snackbar: MatSnackBar) {
    if(data.message){
      data.message = (data.message as string).replace(/\n/g, "<br>");
    }
  }

  upp(type: string){
    return type.toUpperCase();
  }

  close(){
    this._snackbar.dismiss();
  }
}
