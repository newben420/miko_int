import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputDialogConfig } from '../../model/input-dialog-config';
import { LocalRegex } from '@model/regex';
import { GRes } from '@model/res';

@Component({
  selector: 'app-input-dialog',
  standalone: false,
  
  templateUrl: './input-dialog.component.html',
  styleUrl: './input-dialog.component.scss'
})
export class InputDialogComponent {
  initVal!: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: InputDialogConfig) {
    if(data.initVal || data.initVal === 0){
      this.initVal = structuredClone(data.initVal);
      this.val = this.initVal;
    }
  }
  val!: any;
  pattern = LocalRegex;
  gres = GRes;
}
