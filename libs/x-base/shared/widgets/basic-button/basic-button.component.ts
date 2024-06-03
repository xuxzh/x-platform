import { Component, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'x-basic-btn',
  standalone: true,
  imports: [NzButtonModule],
  templateUrl: './basic-button.component.html',
  styleUrl: './basic-button.component.less',
})
export class XBasicButtonComponent {
  @Input() xDanger = false;
}
