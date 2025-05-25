import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeSwitchComponent } from './theme-switch/theme-switch.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import {
  TranslateService,
  TranslatePipe,
  TranslateDirective
} from "@ngx-translate/core";
import { LocaleSwitchComponent } from './locale-switch/locale-switch.component';
import { LocalePickerComponent } from './locale-picker/locale-picker.component';
import { PreloaderComponent } from './preloader/preloader.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmpComponent } from './emp/emp.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { CopyDialogComponent } from './copy-dialog/copy-dialog.component';
import { AssetDialogComponent } from './asset-dialog/asset-dialog.component';
import { WalletDialogComponent } from './wallet-dialog/wallet-dialog.component';
import { StatsDialogComponent } from './stats-dialog/stats-dialog.component';
import { LimitDialogComponent } from './limit-dialog/limit-dialog.component';

@NgModule({
  declarations: [
    ThemeSwitchComponent,
    LocaleSwitchComponent,
    LocalePickerComponent,
    PreloaderComponent,
    ConfirmDialogComponent,
    EmpComponent,
    InputDialogComponent,
    CopyDialogComponent,
    AssetDialogComponent,
    WalletDialogComponent,
    StatsDialogComponent,
    LimitDialogComponent,
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    MatChipsModule,
    TranslateDirective,
    TranslatePipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [
    ThemeSwitchComponent,
    MatIconModule,
    TranslateDirective,
    MatSlideToggleModule,
    LocaleSwitchComponent,
    TranslatePipe,
    MatCardModule,
    MatButtonModule,
    LocalePickerComponent,
    PreloaderComponent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatProgressSpinnerModule,
    EmpComponent,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class PartialModule { }
