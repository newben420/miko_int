import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-emp',
  standalone: false,
  
  templateUrl: './emp.component.html',
  styleUrl: './emp.component.scss'
})
export class EmpComponent {
  @Input("loaded") loaded: boolean = true;
  @Input("message") message: string = "NOTHING";
}
