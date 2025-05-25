import { AfterViewInit, Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { formatForDEX } from '@model/format_for_dex';
import { convertSubscriptTags } from '@model/subconvert';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, CandlestickSeries, WhitespaceData, CandlestickSeriesOptions, DeepPartial, ColorType, CrosshairMode, LineStyle, PriceScaleMode } from 'lightweight-charts';
import { ThemeWatcherService } from '../../services/theme-watcher.service';
import { getDateTime, getDateTimeShort } from '@model/date_time';

@Component({
  selector: 'app-candlestick-chart',
  templateUrl: './candlestick-chart.component.html',
  styleUrls: ['./candlestick-chart.component.css']
})
export class CandlestickChartComponent implements AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef<HTMLDivElement>;
  @Input('data') chartData: (CandlestickData<Time> | WhitespaceData<Time>)[] = [];

  constructor(private themeWatcher: ThemeWatcherService) { }

  private chart!: IChartApi | null;
  private candleSeries!: any;
  private isDark!: boolean;

  ngOnInit() {
    this.isDark = this.themeWatcher.getCurrentTheme();
    this.themeWatcher.watch(isDark => {
      this.isDark = isDark;
      this.initializeChart();
    });
  }

  initializeChart() {
    // Clean up if hot reload or rerender
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }

    this.chart = createChart(this.chartContainer.nativeElement, {
      autoSize: true,
      grid: {
        horzLines: {
          visible: true,
          color: this.isDark ? '#212529' : '#FAF9FD',
          style: LineStyle.Solid,
        },
        vertLines: {
          visible: true,
          color: this.isDark ? '#212529' : '#FAF9FD',
          style: LineStyle.Solid,
        },
      },
      layout: {
        background: { color: this.isDark ? '#191B1E' : '#E0E7EE' },
        textColor: this.isDark ? '#E3E2E6' : '#1A1B1F',
        attributionLogo: false,
      },
      rightPriceScale: {
        borderVisible: false,
        mode: PriceScaleMode.Normal,
        autoScale: true,
        entireTextOnly: true,
        ensureEdgeTickMarksVisible: true,
        textColor: this.isDark ? '#E3E2E6' : '#1A1B1F',
        ticksVisible: true,
        visible: true,
        // minimumWidth: 300,
        scaleMargins: {
          top: 0.2,
          bottom: 0.1,
        },
        borderColor: '#ff0000',
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        ticksVisible: true,
        tickMarkFormatter: (val: any) => getDateTimeShort((val as number) * 1000),
      },
      localization: {
        priceFormatter: (price: number) => this.abbreviate(price),
        timeFormatter: (time: Time) => {
          return getDateTime((time as number) * 1000);
        },
        dateFormat: 'MMM dd',
      },

    });

    this.candleSeries = this.chart.addSeries(CandlestickSeries, {
      baseLineColor: '#ff0000',
      baseLineVisible: true,
      priceFormat: {
        minMove: 0.0000000000000001,
        precision: 5,
      },
    });
    this.updateChart();

    // setTimeout(() => {
    //   const container = this.chartContainer.nativeElement;
    //   this.chart?.resize(container.clientWidth, container.clientHeight);
    // }, 100);
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnDestroy(): void {
    this.chart?.remove();
    this.chart = null;
  }

  abbreviate(value: number): string {
    return convertSubscriptTags(formatForDEX(value));
  }

  public updateChart(data: (CandlestickData<Time> | WhitespaceData<Time>)[] | null = null): void {
    if (data) {
      this.chartData = data;
    }
    this.candleSeries.setData(this.chartData);
  }
}
