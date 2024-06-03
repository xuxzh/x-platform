import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { XAntdModule } from '@x/base/data';
import { XLcdpSharedModule } from '@x/lcdp/shared';

@Component({
  selector: 'xp-designer-layout',
  imports: [RouterOutlet, XAntdModule, XLcdpSharedModule],
  standalone: true,
  styleUrl: './designer-layout.component.less',
  templateUrl: './designer-layout.component.html',
})
export class DesignerLayoutComponent {}
