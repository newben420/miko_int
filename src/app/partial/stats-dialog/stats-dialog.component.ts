import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stats } from '@model/data/stats';

@Component({
  selector: 'app-stats-dialog',
  standalone: false,
  
  templateUrl: './stats-dialog.component.html',
  styleUrl: './stats-dialog.component.scss'
})
export class StatsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Stats) {}
  
    copied: boolean = false;
  
    copy(val: string){
      navigator.clipboard.writeText(val).then(() => {
        this.copied = true;
      }).catch((err) => {
        
      });
    }
}
