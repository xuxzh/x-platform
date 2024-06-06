import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { XDesignerViewMode } from '@x/lcdp/model';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { XJsonDesignerService, XJsonSchemaService } from '@x/lcdp/designer';
import { IDisplayWithIcon } from '@x/base/model';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'xp-menu-bar',
  standalone: true,
  imports: [CommonModule, NzRadioModule, FormsModule, NzIconModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.less',
})
export class MenuBarComponent implements OnInit {
  @Input() rhMode: XDesignerViewMode = 'desktop';
  @Output() rhModeChange = new EventEmitter<XDesignerViewMode>();

  jsonDesignerSer = inject(XJsonDesignerService);
  jsonSchemaSer = inject(XJsonSchemaService);

  viewModeDataset: IDisplayWithIcon[] = [];

  ngOnInit(): void {
    this.viewModeDataset = [
      { name: 'desktop', displayName: '电脑端', icon: 'desktop' },
      { name: 'json', displayName: 'JSON视图', icon: 'field-string' },
      { name: 'code', displayName: '代码视图', icon: 'code' },
      { name: 'preview', displayName: '预览', icon: 'play-circle' },
      // { name: 'mobile', displayName: "移动端" },
    ];
  }

  onViewModeChange(mode: XDesignerViewMode) {
    this.rhModeChange.emit(mode);
    this.jsonDesignerSer.designNodeOperationType =
      this.jsonSchemaSer.jsonSchemaOperationType = null;
  }
}
