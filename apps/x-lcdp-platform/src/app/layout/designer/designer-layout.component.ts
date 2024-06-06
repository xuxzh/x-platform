import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { XAntdModule } from '@x/base/data';
import { XLcdpSharedModule } from '@x/lcdp/shared';
import { MenuBarComponent } from './menu/menu-bar.component';
import {
  XJsonDesignerService,
  XJsonSchemaService,
  XToolbarTabsService,
} from '@x/lcdp/designer';

@Component({
  selector: 'xp-designer-layout',
  imports: [RouterOutlet, XAntdModule, XLcdpSharedModule, MenuBarComponent],
  providers: [XJsonDesignerService, XToolbarTabsService, XJsonSchemaService],
  viewProviders: [XJsonDesignerService, XToolbarTabsService],
  standalone: true,
  styleUrl: './designer-layout.component.less',
  templateUrl: './designer-layout.component.html',
})
export class DesignerLayoutComponent {}
