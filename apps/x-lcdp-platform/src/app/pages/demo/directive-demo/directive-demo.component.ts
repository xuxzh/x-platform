import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PwdDirective,
  DivClassDirective,
  AddTextDirective,
  ReadonlyInputDirective,
  RenderDirective,
} from '@shared';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RhSafeAny } from '@x/base/model';

@Component({
  selector: 'xp-directive-demo',
  standalone: true,
  imports: [
    CommonModule,
    PwdDirective,
    DivClassDirective,
    AddTextDirective,
    ReadonlyInputDirective,
    RenderDirective,
    NzInputModule,
  ],
  templateUrl: './directive-demo.component.html',
  styleUrl: './directive-demo.component.less',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    role: 'menuitem',
  },
})
export class DirectiveDemoComponent implements OnInit {
  text: string | TemplateRef<RhSafeAny> = '测试测试';
  renderer = inject(Renderer2);

  viewContainerRef = inject(ViewContainerRef);
  eleRef = inject(ElementRef);
  el?: HTMLElement;

  cdr = inject(ChangeDetectorRef);

  constructor() {
    //
  }

  ngOnInit(): void {
    this.el = this.eleRef.nativeElement;
    const renderDiv = this.renderer.createElement('div');
    renderDiv.innerHTML = 'x-lcdp-render';
    this.renderer.setAttribute(renderDiv, 'class', 'x-lcdp-render');
    this.renderer.appendChild(this.el, renderDiv);
    this.cdr.markForCheck();
  }
}
