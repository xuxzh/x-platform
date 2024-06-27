import { Component, Input } from '@angular/core';
import { XCompRenderDirective } from './comp-render.directive';
import { IComponentSchema } from '@x/lcdp/model';

@Component({
  selector: 'x-comp-render',
  template: `
    <ng-container xCompRender [rhComponentSchema]="rhData"></ng-container>
  `,
  standalone: true,
  imports: [XCompRenderDirective],
})
export class XCompRenderComponent {
  @Input() rhData!: IComponentSchema;
}
