import { Component, Inject } from '@angular/core';
import { LocalRegex } from '@model/regex';
import { deepEqual } from '@model/deep_equal';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditMode } from '@model/edit_mode';
import { GRes } from '@model/res';
import { PmodelService } from '../../services/pmodel.service';
import { Pair } from '@model/persistence_model';

@Component({
  selector: 'app-asset-dialog',
  standalone: false,
  
  templateUrl: './asset-dialog.component.html',
  styleUrl: './asset-dialog.component.scss'
})
export class AssetDialogComponent {
  schema!: Pair;
  isNew!: boolean;
  pattern = LocalRegex;
  initialSchema!: Pair;
  usedPairs:Pair[] = [];
  quotes: string[] = []
  bases: string[] = []
  de = deepEqual;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private model: PmodelService,) {
    this.isNew = data.mode === EditMode.NEW;
    this.schema = data.schema;
    this.initialSchema = structuredClone(data.schema);
    this.usedPairs = model.getCurrent().pairs ? model.getCurrent().pairs!.filter(x => true) : [];
    this.quotes = Array.from(new Set(this.usedPairs.map(x => x.quote)));
    this.bases = Array.from(new Set(this.usedPairs.map(x => x.base)));

  }

  gres = GRes;
  pairInUse(){
    return this.isNew ? (this.usedPairs.findIndex(x => x.base == this.schema.base && x.quote == this.schema.quote) >= 0) : false;
  }
}
