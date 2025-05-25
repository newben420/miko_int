import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Wallet } from '@model/data/wallet';
import { formatNumber } from '@model/format_number';

@Component({
  selector: 'app-wallet-dialog',
  standalone: false,
  
  templateUrl: './wallet-dialog.component.html',
  styleUrl: './wallet-dialog.component.scss'
})
export class WalletDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Wallet) {}

  copied: boolean = false;

  FN = formatNumber;

  copy(val: string){
    navigator.clipboard.writeText(val).then(() => {
      this.copied = true;
    }).catch((err) => {
      
    });
  }

}
