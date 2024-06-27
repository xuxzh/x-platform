import {
  AfterViewInit,
  Directive,
  Renderer2,
  ViewContainerRef,
  inject,
} from '@angular/core';

/**
 * 仅用于测试的指令，其他情况请勿使用
 */
@Directive({
  selector: '[xBaseTest]',
  standalone: true,
})
export class XBaseTestDirective implements AfterViewInit {
  hostView = inject(ViewContainerRef);
  renderer2 = inject(Renderer2);

  ngAfterViewInit(): void {
    this.renderer2.setStyle(
      this.hostView.element.nativeElement,
      'background',
      'green'
    );
  }
}
