import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XSharedModule } from '@x/base/shared';
import { XLcdpSharedModule } from '@x/lcdp/shared';
import { FormsModule } from '@angular/forms';
import { IComponentResource } from '@x/lcdp/model';
import { RH_COMPONENT_SOURCE_CONFIG } from '@x/lcdp/data';

@Component({
  selector: 'xp-designer-pool',
  standalone: true,
  imports: [CommonModule, FormsModule, XSharedModule, XLcdpSharedModule],
  templateUrl: './designer-pool.component.html',
  styleUrl: './designer-pool.component.less',
})
export class DesignerPoolComponent {
  searchValue = '';

  collapseDataset: IComponentResource[] = inject(RH_COMPONENT_SOURCE_CONFIG);

  searchValueChange(searchValue: string) {
    //
  }

  onDragToDesigner(item: IComponentResource) {
    //
  }
}
