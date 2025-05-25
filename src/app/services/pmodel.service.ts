import { Injectable } from '@angular/core';
import { PModel } from '@model/persistence_model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PmodelService {
  private pmodel = new BehaviorSubject<PModel>({});
  pmodelEvent = this.pmodel.asObservable();
  updatePModel(model: PModel){
    this.pmodel.next(model);
  }
  getCurrent(){
    return this.pmodel.value;
  }
  constructor() { }
}
