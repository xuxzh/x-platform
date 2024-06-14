import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XSharedModule } from '@x/base/shared';
import { XLcdpSharedModule } from '@x/lcdp/shared';
import { FormsModule } from '@angular/forms';
import { IComponentResource } from '@x/lcdp/model';
import { X_COMPONENT_POOL } from '@x/lcdp/shared';
import { XLcdpDesignerModule } from '@x/lcdp/designer';

@Component({
  selector: 'xp-designer-pool',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    XSharedModule,
    XLcdpDesignerModule,
    XLcdpSharedModule,
  ],
  templateUrl: './designer-pool.component.html',
  styleUrl: './designer-pool.component.less',
})
export class DesignerPoolComponent {
  searchValue = '';

  collapseDataset: IComponentResource[] = inject(X_COMPONENT_POOL);

  searchValueChange(searchValue: string) {
    //
  }

  onDragToDesigner(item: IComponentResource) {
    //
  }
}
