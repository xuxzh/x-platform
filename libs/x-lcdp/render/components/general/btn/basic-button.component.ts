import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'x-basic-button',
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  templateUrl: './basic-button.component.html',
  styleUrl: './basic-button.component.less',
})
export class XBasicButtonComponent {
  @Input() xDanger = false;

  onClickBtn(event: Event) {
    console.log(event);
  }
}
