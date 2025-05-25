import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UILimitOrder } from '@model/data/token';
import { LocalRegex } from '@model/regex';
import { GRes } from '@model/res';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-limit-dialog',
  standalone: false,
  templateUrl: './limit-dialog.component.html',
  styleUrl: './limit-dialog.component.scss'
})
export class LimitDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: UILimitOrder, private store: StorageService) {
    this.data.isBuy = this.store.get("lim_buy") == "t";
    this.data.isGreaterThan = this.store.get("lim_gt") == "t";
    this.data.trailing = this.store.get("lim_trail") == "t";
    data.min_time = 0;
    data.max_time = 0;
    data.min_sell_pnl = 0;
    data.max_sell_pnl = 0;
  }

  toggleBuy() {
    this.data.isBuy = !this.data.isBuy;
    this.store.set('lim_buy', this.data.isBuy ? 't' : 'f');
    this.setAmount(0);
  }

  toggleGT() {
    this.data.isGreaterThan = !this.data.isGreaterThan;
    this.store.set('lim_gt', this.data.isGreaterThan ? 't' : 'f');
  }

  toggleTrail(v: boolean) {
    this.store.set('lim_trail', this.data.trailing ? 't' : 'f');
  }

  setAmount(amount: number) {
    if (this.data.amount == amount) {
      this.data.amount = 0;
    }
    else {
      this.data.amount = amount;
    }
  }

  valid(formValid: boolean) {
    return formValid &&
      (this.data.marketcap > 0) &&
      (this.data.amount > 0) &&
      (this.data.trailing ?
        (
          (this.data.perc && this.data.perc < 0) &&
          (this.data.max_time || this.data.max_time === 0) &&
          (this.data.min_time || this.data.min_time === 0) &&
          (this.data.max_sell_pnl || this.data.max_sell_pnl === 0) &&
          (this.data.min_sell_pnl || this.data.min_sell_pnl === 0) &&
          (this.data.max_time >= this.data.min_time && this.data.min_time >= 0) &&
          (this.data.max_sell_pnl >= this.data.min_sell_pnl && this.data.min_sell_pnl >= -100)
        ) :
        true);
  }

  pattern = LocalRegex;
  gres = GRes;
}
