import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { XCanvasWithRulerComponent } from '@x/lcdp/shared';

@Component({
  selector: 'xp-only-demo',
  standalone: true,
  imports: [CommonModule, NzDividerModule, XCanvasWithRulerComponent],
  templateUrl: './only-demo.component.html',
  styleUrl: './only-demo.component.less',
})
export class OnlyDemoComponent {
  dividerStyle = {
    fontWeight: 'bold',
    color: 'red',
  };
}
