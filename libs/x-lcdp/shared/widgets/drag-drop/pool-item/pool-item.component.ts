import { NzIconModule } from 'ng-zorro-antd/icon';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDisplayWithIcon, RhSafeAny } from '@x/base/model';

@Component({
  selector: 'x-pool-item',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './pool-item.component.html',
  styleUrl: './pool-item.component.less',
})
export class XPoolItemComponent implements OnInit {
  @Input() rhData!: IDisplayWithIcon;
  @Input() rhCustomItemContentTpl?: TemplateRef<RhSafeAny>;

  icon!: string;
  constructor() {
    //
  }

  ngOnInit(): void {
    this.icon = this.rhData?.icon ? this.rhData.icon : 'tags';
  }
}
