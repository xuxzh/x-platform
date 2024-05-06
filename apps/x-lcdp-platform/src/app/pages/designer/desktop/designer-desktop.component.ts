import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignerConfigComponent } from './config/designer-config.component';
import { DesignerPoolComponent } from './pool/designer-pool.component';
import { DesignerCanvasComponent } from './canvas/designer-canvas.component';

/**
 * 桌面端设计界面
 */
@Component({
  selector: 'xp-designer',
  standalone: true,
  imports: [
    CommonModule,
    DesignerConfigComponent,
    DesignerPoolComponent,
    DesignerCanvasComponent,
  ],
  templateUrl: './designer-desktop.component.html',
  styleUrl: './designer-desktop.component.less',
})
export class DesignerDesktopComponent {}
