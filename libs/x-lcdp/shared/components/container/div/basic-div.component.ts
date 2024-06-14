import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XDroplistContainerComponent } from './../../../widgets/drag-drop/droplist-container/droplist-container.component';
import { XLcdpBase } from '../../base';

@Component({
  selector: 'x-basic-div',
  standalone: true,
  imports: [CommonModule, XDroplistContainerComponent],
  templateUrl: './basic-div.component.html',
  styleUrl: './basic-div.component.less',
})
export class XBasicDivComponent extends XLcdpBase {
  onClick() {
    //
  }
}
