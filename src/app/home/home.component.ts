import { Kiko, KikoToken } from '@model/data/kiko';
import { Automation } from '@model/data/aut';
import { formatNumber } from '@model/format_number';
import { getDateTime, getTimeElapsed } from '@model/date_time';
import { Pair, PModel } from '@model/persistence_model';
import { Component, HostListener, ViewChild } from '@angular/core';
import { PartialModule } from '../partial/partial.module';
import { AlertService } from '../services/alert.service';
import { Socket } from 'ngx-socket-io';
import { PreloaderService } from '../services/preloader.service';
import { DialogService } from '../services/dialog.service';
import { Subscription } from 'rxjs';
import { Res } from '@model/res';
import { Title } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { PmodelService } from '../services/pmodel.service';
import { EditMode } from '@model/edit_mode';
import { LocalRegex } from '@model/regex';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Wallet } from '@model/data/wallet';
import { Stats } from '@model/data/stats';
import { LimitOrder, OHLCV, PriceHistory, SideToken, Token, Tokens, UILimitOrder } from '@model/data/token';
import { formatForDEX } from '@model/format_for_dex';
import { StorageService } from '../services/storage.service';

import { CandlestickData, Time, WhitespaceData } from 'lightweight-charts';
import { CandlestickChartComponent } from '../partial/candlestick-chart/candlestick-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PartialModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatListModule,
    MatSidenavModule,
    CommonModule,
    CandlestickChartComponent,
    MatMenuModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  chartHeight: number = 0;

  chartData: (CandlestickData<Time> | WhitespaceData<Time>)[] = [];
  @ViewChild(CandlestickChartComponent, { read: CandlestickChartComponent, }) chartComponent!: CandlestickChartComponent;
  async updateChart() {
    let trial = 10;
    while (trial > 0) {
      if (this.chartComponent) {
        await this.processedCandlestickData();
        this.chartComponent.updateChart(this.chartData);
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      trial--;
    }
  }
  constructor(
    private alrt: AlertService,
    private socket: Socket,
    private prel: PreloaderService,
    private dia: DialogService,
    private titleService: Title,
    private model: PmodelService,
    private store: StorageService,
  ) {
    socket.on("connect", () => {
      this.connected = true;
      this.initialLoad();
      const mint = this.store.get("token");
      if (mint && this.tokens[mint]) {
        this.openToken(mint);
      }
    });
    socket.on("disconnect", () => {
      this.connected = false;
    });
    socket.on("automation", (data: Automation) => {
      this.aut = data;
    });
    socket.on("kiko", async (data: Kiko | string, del: boolean = false) => {
      if (del) {
        // delete token
        if (this.kiko.audited) {
          delete this.kiko.audited[data as string];
        }
      }
      else {
        // object update
        if (!this.kikoLoaded) {
          this.kikoLoaded = true;
        }
        await this.reconcile(data, this.kiko);
      }
    });
    socket.on("tokens", async (data: Tokens | string, del: boolean = false) => {
      if (del) {
        // delete token
        delete this.tokens[data as string];
      }
      else {
        // object update
        if (!this.tokensLoaded) {
          this.tokensLoaded = true;
        }
        await this.reconcile(data, this.tokens);
        if (!this.firstOpened) {
          const mint = this.store.get("token");
          if (mint && this.tokens[mint]) {
            this.openToken(mint);
          }
        }
      }
    });
    socket.on("error", (message: any) => {
      this.sendNote(message);
    });
    socket.on("token_update", (data: Token) => {
      const attrs = Object.keys(data).filter(key => (data as any)[key] !== undefined && (data as any)[key] !== null);
      attrs.forEach(key => {
        if (key == "price_history" && this.tokenData.price_history !== undefined) {
          this.tokenData.price_history = this.tokenData.price_history.concat(data.price_history!);
          if (this.tokenData.price_history.length > this.maxCDSlength) {
            this.tokenData.price_history = this.tokenData.price_history.slice(this.tokenData.price_history.length - this.maxCDSlength);
          }
          this.updateChart();
          this.priceHistCompute();
        }
        else if (key == "whaleLog" && this.tokenData.whaleLog !== undefined) {
          this.tokenData.whaleLog = this.tokenData.whaleLog.concat(data.whaleLog!);
          if (this.tokenData.whaleLog.length > this.maxLogslength) {
            this.tokenData.whaleLog = this.tokenData.whaleLog.slice(this.tokenData.whaleLog.length - this.maxLogslength);
          }
        }
        else {

          (this.tokenData as any)[key] = (data as any)[key];
        }
      });
      if ((attrs.indexOf('price_history') >= 0) && (attrs.indexOf('current_price') < 0)) {
        // Candlestick data updated.
        // restart live candle.
        this.liveCandle = new OHLCV();
      }
      else if ((attrs.indexOf('price_history') < 0) && (attrs.indexOf('current_price') >= 0)) {
        // Price updated without candlestick data.
        // update live candle.
        const price = data.current_price;
        if (price && this.liveCandle) {
          if (this.liveCandle.open === undefined || this.liveCandle.open === null) {
            this.liveCandle.open = (((this.tokenData.price_history || []).slice(-1)[0] || {}).close || 0) || price;
          }
          if (this.liveCandle.high === undefined || this.liveCandle.high === null || (this.liveCandle.high && this.liveCandle.high < price)) {
            this.liveCandle.high = price;
          }
          if (this.liveCandle.low === undefined || this.liveCandle.low === null || (this.liveCandle.low && this.liveCandle.low > price)) {
            this.liveCandle.low = price;
          }
          this.liveCandle.close = price;
          // For volume, we just increment since we are not sending trade volume data and volume is not really used in the chart (unless we are using volume required indicators), especially the final dynamic candle.
          if (this.liveCandle.volume === undefined || this.liveCandle.volume === null) {
            this.liveCandle.volume = 0;
          }
          this.liveCandle.volume++;

          this.liveCandle.time = (Math.floor(this.currentTime / 1000));
          this.updateChart();
        }
      }
    });
    socket.on("note", (message: string) => {
      if (this.serverAlerts) {
        this.sendNote(message);
      }
    });
    socket.on("sol_price", (message: number) => {
      this.solPrice = message;
    });
    socket.on("static_content", (data: any) => {
      this.title = data.title ?? "";
      this.currentTime = data.ts || 0;
      this.aut = data.auth ?? false;
      this.url = data.url ?? "";
      this.maxCDSlength = data.maxCDSlength ?? 100;
      this.maxLogslength = data.maxLogslength ?? 100;
      this.base = data.base ?? "SOL";
      this.baseDenominated = data.baseDenominated ?? false;
      if (data.title) {
        this.titleService.setTitle(data.title);
      }
      if (data.buys) {
        this.buys = data.buys;
      }
      if (data.sells) {
        this.sells = data.sells;
      }
      if (data.histories) {
        this.histories = data.histories;
      }
      if (data.interval) {
        this.interval = data.interval;
      }
      if (data.chartOpts) {
        this.chartOpts = data.chartOpts;
      }
      if (data.chartHeight) {
        this.chartHeight = data.chartHeight;
      }
    });
    this.loadLocals();
  }

  logout() {
    this.closeOnMobile();
    this.dia.confirm('APP.LOGOUT.CONFIRM', yes => {
      if (yes) {
        this.prel.show();
        window.location.href = `${this.url}/logout`;
      }
    });
  }

  sendNote(message: string) {
    this.alrt.show("alert", `<span class="">${message.replace(/[*`\\]/g, "").replace(/[\n\s]*$/g, "").replace(/[\n]{2,}/g, "\n\n")}</span>`, {
      tr: {
        title: this.title,
      },
      duration: 1000,
    });
  }

  addToken() {
    this.dia.getInput({
      title: `APP.TOKENS.ADD`,
      label: `APP.TOKENS.LABEL`,
      hint: `APP.TOKENS.INS`,
      maxLength: 200,
      required: true,
      type: 'text',
      pattern: LocalRegex.mint,
      callback: val => {
        if (val.succ) {
          this.prel.show();
          this.socket.emit("add_token", val.message, (name: string | null) => {
            this.prel.hide();
            if (name) {
              this.alrt.show('success', 'APP.TOKENS.ADD_SUCC', { tr: { name } });
            }
            else {
              this.alrt.show('error', 'APP.TOKENS.ADD_ERR');
            }
          });
        }
      }
    });
  }

  FM = formatNumber;
  FFD = formatForDEX;

  copy(val: string) {
    const ml = 100;
    if (val) {
      navigator.clipboard.writeText(val).then(() => {
        this.alrt.show('success', `"${val.length > ml ? `${val.slice(0, ml)}...` : val}"`, { duration: 500 });
      }).catch((err) => {

      });
    }
  }

  selectedTabIndex: number = 1;
  aut: Automation = new Automation();
  kiko: Kiko = new Kiko();
  connected: boolean = false;
  kikoLoaded: boolean = false;
  tokensLoaded: boolean = false;
  currentTime: number = Date.now();
  opened: boolean = true;
  windowWidth: number = window.innerWidth;
  widthBreakPoint: number = 768;
  tokensExpanded: boolean = false;
  auth: boolean = false;
  token: string = "";
  url: string = "";
  tokens: Tokens = {};
  tokenData: Token = new Token();
  solPrice: number = 0;
  maxCDSlength: number = 100;
  base: string = "SOL";
  baseDenominated: boolean = false;
  maxLogslength: number = 100;
  buys: number[] = [];
  sells: number[] = [];
  histories: number[] = [];
  interval: number = 0;
  chartOpts: number[] = [];
  currentOpt: number = 1;
  liveCandle: OHLCV = new OHLCV();

  expChart: boolean = false;
  isChart: boolean = false;
  expStat: boolean = false;
  expBuy: boolean = false;
  expSell: boolean = false;
  expLimit: boolean = false;
  expWhale: boolean = false;
  expDesc: boolean = false;
  showRem: boolean = false;
  serverAlerts: boolean = true;

  changeOpt(val: number) {
    this.currentOpt = val;
    this.store.set("copts", `${val}`);
    this.updateChart();
  }

  processedCandlestickData() {
    return new Promise<boolean>((resolve, reject) => {
      let r: (CandlestickData<Time> | WhitespaceData<Time>)[] = [];
      if ((this.tokenData.price_history ? (this.tokenData.price_history.length > 0) : false) && this.currentOpt) {
        for (let i = 0; i < this.tokenData.price_history!.length; i += this.currentOpt) {
          const sub = this.tokenData.price_history!.slice(i, i + this.currentOpt);
          const high = Math.max(...sub.map(x => x.high || 0));
          const low = Math.min(...sub.map(x => x.low || 0));
          const open = sub[0].open || 0;
          const close = sub.slice(-1)[0].close || 0;
          const time = sub.slice(-1)[0].time || 0;
          const volume = sub.map(x => x.volume || 0).reduce((a, b) => a + b, 0);
          const mul = 1;
          const row = {
            open: open * mul,
            high: high * mul,
            low: low * mul,
            close: close * mul,
            volume,
            time: (Math.floor(time / 1000) as Time)
          };
          r.push(row);
        }
      }
      this.chartData = r.concat(((this.liveCandle.close) ? [{...this.liveCandle, time: ((((r[r.length -1] || {}).time || Math.floor(Date.now() / 1000)) as number) + Math.floor(this.interval / 1000)) as Time}] : []) as (CandlestickData<Time> | WhitespaceData<Time>)[]);
      resolve(true);
    })
  }

  closeToken() {
    this.socket.emit("close_token");
    this.token = "";
    this.store.set("token", "");
  }

  initialLoad() {
    this.closeOnMobile();
    this.kiko = new Kiko();
    this.kikoLoaded = false;
    this.tokens = {};
    this.tokensLoaded = false;
    this.socket.emit("init");
  }

  loadLocals() {
    this.tokensExpanded = this.store.get('exp_tok') == "t";
    this.expChart = this.store.get('exp_cha') == "t";
    this.isChart = this.store.get('is_cha') == "t";
    this.expStat = this.store.get('exp_sta') == "t";
    this.showRem = this.expStat;
    this.expBuy = this.store.get('exp_buy') == "t";
    this.expSell = this.store.get('exp_sel') == "t";
    this.expLimit = this.store.get('exp_lim') == "t";
    this.expWhale = this.store.get('exp_wha') == "t";
    this.serverAlerts = this.store.get('sart') == "t";
    this.expDesc = this.store.get('exp_des') == "t";
    this.selectedTabIndex = parseInt(this.store.get('tabi') || "0") || 1;
    this.currentOpt = Math.abs(Math.round(parseInt(this.store.get('copts') || "0") || 1));
  }

  resetToken(mint: string){
    this.dia.confirm("SURE", yes => {
      if(yes){
        this.prel.show();
        this.socket.emit("reset_token", mint, (done: boolean) => {
          this.prel.hide();
          if(done){
            this.openToken(mint);
          }
          else{
            this.alrt.show("error", "FAILED");
          }
        });
      }
    });
  }

  exp(e: boolean, attr: string) {
    this.store.set(attr, e ? 't' : 'f');
    if (attr == "exp_sta") {
      this.showRem = e;
    }
  }

  toggleChart() {
    this.isChart = !this.isChart;
    this.exp(this.isChart, 'is_cha');
  }

  toggleStat() {
    this.expStat = !this.expStat;
    this.exp(this.expStat, 'exp_sta');
  }

  tabSwitch(i: number) {
    this.store.set(`tabi`, `${i}`);
  }

  firstOpened: boolean = false;

  openToken(mint: string) {
    this.prel.show();
    this.socket.emit("open_token", mint, (tk: Token | null) => {
      this.prel.hide();
      if (tk) {
        this.closeOnMobile();
        this.liveCandle = new OHLCV();
        this.tokenData = tk;
        this.token = mint;
        this.firstOpened = true;
        this.store.set("token", mint);
        this.updateChart();
        this.priceHistCompute();
      }
      else {
        this.alrt.show("error", "APP.TOKENS.OPEN_ERR");
      }
    });
  }

  buy(mint: string, amount: number) {
    this.prel.show();
    this.socket.emit("buy", mint, amount, (message: string) => {
      console.log(mint, amount);
      this.prel.hide();
      this.sendNote(message);
    });
  }

  sell(mint: string, perc: number) {
    this.prel.show();
    this.socket.emit("sell", mint, perc, (message: string) => {
      this.prel.hide();
      this.sendNote(message);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.windowWidth = (event.target as Window).innerWidth;
  }

  toggleSide() {
    this.opened = !this.opened;
  }

  closeOnMobile() {
    if (this.windowWidth <= this.widthBreakPoint) {
      this.opened = false;
    }
  }

  GTE = getTimeElapsed;

  removeToken(mint: string) {
    this.dia.confirm('SURE', yes => {
      if (yes) {
        this.prel.show();
        this.socket.emit("remove_token", mint, () => {
          this.prel.hide();
          this.alrt.show("success", "SUCCESS");
        });
      }
    });
  }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    this.opened = this.windowWidth > this.widthBreakPoint;
    const tu: number = parseInt(import.meta.env["NG_APP_TIME_UPDATE_INTERVAL_MS"] || "10000");
    setInterval(() => {
      this.currentTime += tu;
    }, tu);
  }

  rev(arr: any[]) {
    return arr.filter(x => true).reverse();
  }

  priceHistCompute() {
    let data: OHLCV[] = this.tokenData.price_history || [];
    let m: PriceHistory[] = [];
    if (this.histories.length > 0 && data.length > 0 && this.interval > 0) {
      for (let j: number = 0; j < this.histories.length; j++) {
        const interv = this.histories[j];
        const div = Math.ceil(interv / this.interval);
        const l = data.length;
        const firstIndex = data.length - 1;
        const finalIndex = Math.max(0, l - div);
        const from = data[firstIndex].close || 0;
        const to = data[finalIndex].close || 0;
        const diff = ((from - to) / to * 100) || 0;
        m.push({
          title: getTimeElapsed(0, interv),
          delta: (Math.round(diff * 100) / 100),
        });
      }
    }
    this.pricehist = m;
  }

  pricehist: PriceHistory[] = [];

  limitOrder() {
    const data = new UILimitOrder();
    data.currency = this.baseDenominated ? this.base : "USD";
    data.buys = this.buys;
    data.sells = this.sells;
    this.dia.limit(data, r => {
      if (r.succ) {
        this.prel.show();
        this.socket.emit("add_limit", this.token, r.message, (message: string) => {
          this.prel.hide();
          this.sendNote(message);
        });
      }
    });
  }

  deleteLimitOrder(index: number, order: LimitOrder) {
    this.prel.show();
    this.socket.emit("delete_limit", this.token, index, (message: string) => {
      this.prel.hide();
      this.sendNote(message);
    });
  }

  attrCount(obj: any) {
    if (!obj) return 0;
    return Object.keys(obj).length;
  }

  obj2arr(obj: any) {
    if (!obj) return [];
    return Object.keys(obj).map(x => obj[x]);
  }

  abs(x: number) {
    return Math.abs(x);
  }

  reconcile(d: any, origin: any, keys: string[] = []): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      let k = Object.keys(d);
      for (const i of k) {
        if (d[i] !== undefined && d[i] !== null) {
          if (typeof d[i] == "object" && (Object.keys(d[i]).filter(j => d[i][j] !== undefined && d[i][j] !== null).length > 0)) {
            await this.reconcile(d[i], origin, keys.concat([i]));
          }
          else {
            let ref: any = origin;
            let good: boolean = true;
            for (const attr of keys) {
              if (ref[attr]) {
                ref = ref[attr];
              }
              else {
                ref[attr] = {};
                ref = ref[attr];
              }
            }
            if (ref && good) {
              ref[i] = d[i];
            }
          }
        }
      }
      resolve(true);
    });
  }

  recover() {
    this.closeOnMobile();
    this.socket.emit("recovery", (done: boolean) => {
      this.alrt.show(done ? 'success' : 'error', done ? `APP.REC.SUCC` : `APP.REC.ERR`);
    });
  }

  wallet() {
    this.closeOnMobile();
    this.prel.show();
    this.socket.emit("wallet", (r: Wallet) => {
      this.prel.hide();
      if (r.succ) {
        this.dia.wallet(r);
      }
      else {
        this.alrt.show('error', `APP.WAL.ERR`);
      }
    });
  }

  stats() {
    this.closeOnMobile();
    this.prel.show();
    this.socket.emit("stats", (r: Stats) => {
      this.prel.hide();
      if (r.succ) {
        this.dia.stats(r);
      }
      else {
        this.alrt.show('error', `APP.STA.ERR`);
      }
    });
  }

  year() {
    return (new Date(this.currentTime)).getFullYear();
  }

  editAut(variable: string, e: MatSlideToggleChange) {
    let newValue = e.checked;
    this.socket.emit("edit_auto", { variable, newValue });
  }

  subs: Record<string, Subscription> = {};
  logo: string = import.meta.env["NG_APP_LOGO"] || "";
  title: string = "Miko";

  ngOnDestroy() {
    Object.keys(this.subs).forEach(x => {
      this.subs[x].unsubscribe();
    });
  }
}
