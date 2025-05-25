import { Injectable } from '@angular/core';
import { BoolParamFx, ResParamFx, StringParamFx } from '@model/functions';
import { LocaleService } from './locale.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../partial/confirm-dialog/confirm-dialog.component';
import { GRes, Res } from '@model/res';
import { InputDialogConfig } from '../model/input-dialog-config';
import { InputDialogComponent } from '../partial/input-dialog/input-dialog.component';
import { CopyDialogConfig } from '../model/copy-dialog-config';
import { CopyDialogComponent } from '../partial/copy-dialog/copy-dialog.component';
import { EditMode } from '@model/edit_mode';
import { AssetDialogComponent } from '../partial/asset-dialog/asset-dialog.component';
import { Pair } from '@model/persistence_model';
import { Wallet } from '@model/data/wallet';
import { WalletDialogComponent } from '../partial/wallet-dialog/wallet-dialog.component';
import { Stats } from '@model/data/stats';
import { StatsDialogComponent } from '../partial/stats-dialog/stats-dialog.component';
import { LimitOrder, UILimitOrder } from '@model/data/token';
import { LimitDialogComponent } from '../partial/limit-dialog/limit-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private locale: LocaleService,
    private dialog: MatDialog,
  ) { }

  confirm(title: string, callback: BoolParamFx, val: any = {}) {
    this.locale.conv([title], tr => {
      title = tr[0];
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { message: title },
        autoFocus: true,
        disableClose: true,
        hasBackdrop: true,
        panelClass: "p-2",
        restoreFocus: true,
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          callback(true);
        }
        else {
          callback(false);
        }
      });
    }, val);
  }

  wallet(data: Wallet){
    const dialogRef = this.dialog.open(WalletDialogComponent, {
      data,
      autoFocus: true,
      minWidth: '300px',
      maxWidth: '100%',
      disableClose: true,
      hasBackdrop: true,
      restoreFocus: true,
      panelClass: "p-2"
    });

    dialogRef.afterClosed().subscribe((r) => {
      // do nothing
    });
  }

  stats(data: Stats){
    const dialogRef = this.dialog.open(StatsDialogComponent, {
      data,
      autoFocus: true,
      minWidth: '300px',
      maxWidth: '100%',
      disableClose: true,
      hasBackdrop: true,
      restoreFocus: true,
      panelClass: "p-2"
    });

    dialogRef.afterClosed().subscribe((r) => {
      // do nothing
    });
  }

  limit(data: UILimitOrder, cb: ResParamFx){
    const dialogRef = this.dialog.open(LimitDialogComponent, {
      data: data,
      autoFocus: true,
      minWidth: '300px',
      maxWidth: '100%',
      disableClose: true,
      hasBackdrop: true,
      restoreFocus: true,
      panelClass: "p-2"
    });

    dialogRef.afterClosed().subscribe((r: Res) => {
      if(r.succ){
        let order = new LimitOrder();
        let lo: UILimitOrder = r.message;
        order.amount = lo.amount;
        order.marketcap = lo.marketcap * (((lo.isBuy && lo.isGreaterThan) || ((!lo.isBuy) && (!lo.isGreaterThan))) ? -1 : 1);
        order.type = lo.isBuy ? "buy" : "sell";
        order.min_time = lo.min_time || 0;
        order.max_time = lo.max_time || 0;
        if((!lo.isBuy) && (!lo.isGreaterThan)){
          order.trailing = lo.trailing;
          if(lo.trailing){
            order.perc = lo.perc;
            order.min_sell_pnl = lo.min_sell_pnl ?? Number.MIN_VALUE;
            order.max_sell_pnl = lo.max_sell_pnl || Number.MAX_VALUE;
          }
        }
        Object.keys(order).forEach(key => {
          if((order as any)[key] === undefined){
            delete (order as any)[key];
          }
        })
        cb(GRes.succ(order));
      }
      else{
        cb(r);
      }
    });
  }

  getInput(config: InputDialogConfig) {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      data: config,
      autoFocus: true,
      minWidth: '300px',
      maxWidth: '100%',
      disableClose: true,
      hasBackdrop: true,
      restoreFocus: true,
      panelClass: "p-2"
    });

    dialogRef.afterClosed().subscribe((r) => {
      config.callback(r);
    });
  }

  copy(config: CopyDialogConfig) {
    const dialogRef = this.dialog.open(CopyDialogComponent, {
      data: config,
      autoFocus: true,
      minWidth: '300px',
      maxWidth: '100%',
      disableClose: true,
      hasBackdrop: true,
      restoreFocus: true,
      panelClass: "p-2"
    });

    dialogRef.afterClosed().subscribe((r) => {
      if (config.callback) {
        config.callback();
      }
    });
  }

  editPair(mode: EditMode, schema: Pair, callback: ResParamFx) {
    const dialogRef = this.dialog.open(AssetDialogComponent, {
      data: { mode, schema },
      autoFocus: true,
      minWidth: '300px',
      maxWidth: '100%',
      disableClose: true,
      hasBackdrop: true,
      restoreFocus: true,
      panelClass: "p-2"
    });

    dialogRef.afterClosed().subscribe((r) => {
      callback(r);
    });
  }
}
