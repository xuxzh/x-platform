import { XBaseTestDirective } from '@x/base/shared';
import { Component, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XLcdpBase } from '../../base';
import {
  XCompRenderDirective,
  XDroplistContainerComponent,
} from '@x/lcdp/shared';

@Component({
  selector: 'x-basic-div',
  standalone: true,
  imports: [
    CommonModule,
    XBaseTestDirective,
    XCompRenderDirective,
    forwardRef(() => XDroplistContainerComponent),
  ],
  templateUrl: './basic-div.component.html',
  styleUrl: './basic-div.component.less',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[style]': `wrapperStyle`,
  },
})
export class XBasicDivComponent extends XLcdpBase implements OnInit {
  wrapperStyle = { display: 'block', width: '100%', height: '100%' };
  ngOnInit() {
    console.log(this._nodeData);
  }
  onClick() {
    // MsgHelper.ShowErrorMessage('测试！！！');
  }
}
