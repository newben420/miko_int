import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CopyDialogConfig } from '../../model/copy-dialog-config';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-copy-dialog',
  standalone: false,
  
  templateUrl: './copy-dialog.component.html',
  styleUrl: './copy-dialog.component.scss'
})
export class CopyDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CopyDialogConfig) {}

  copy(val: any, index: number){
    navigator.clipboard.writeText(val).then(() => {
      this.data.items[index].copied = true;
    }).catch((err) => {
      
    });
  }

  allCopied(): boolean{
    return this.data.items.findIndex(x => !x.copied) != -1;
  }
}
