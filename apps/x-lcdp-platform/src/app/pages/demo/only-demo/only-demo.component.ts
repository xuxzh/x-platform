import { CommonModule, NgFor } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  ViewContainerRef,
  inject,
} from '@angular/core';
// import { XCanvasWithRulerComponent } from '@x/lcdp/shared';
// import { NzDividerModule } from 'ng-zorro-antd/divider';

import { ɵcompileComponent } from '@angular/core';

function getComponentFromTemplate(template: string) {
  ɵcompileComponent(MyCustomComponent, {
    template,
    standalone: true,
    imports: [NgFor],
  });

  return MyCustomComponent;
}

@Component({
  selector: 'xp-only-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './only-demo.component.html',
  styleUrl: './only-demo.component.less',
})
export class OnlyDemoComponent implements OnInit {
  // dividerStyle = {
  //   fontWeight: 'bold',
  //   color: 'red',
  // };
  viewRef = inject(ViewContainerRef);

  ngOnInit(): void {
    const template = '<div *ngFor="let item of items">{{item}}<div>';
    const component = getComponentFromTemplate(template);
    const componentRef = this.viewRef.createComponent(component);

    componentRef.setInput('items', ['1', '2', '3']);
  }
}

@Component({
  template: '',
})
export class MyCustomComponent {
  @Input() items: string[] = [];
}
