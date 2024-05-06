import { RhSafeAny } from '@x/base/model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XSharedModule } from '@x/base/shared';
import { XLcdpSharedModule } from '@x/lcdp/shared';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'xp-designer-pool',
  standalone: true,
  imports: [CommonModule, FormsModule, XSharedModule, XLcdpSharedModule],
  templateUrl: './designer-pool.component.html',
  styleUrl: './designer-pool.component.less',
})
export class DesignerPoolComponent {
  searchValue = '';

  collapseDataset: RhSafeAny[] = [];

  searchValueChange(searchValue: string) {
    //
  }
}
