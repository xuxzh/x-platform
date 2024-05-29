import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '.x-lcdp-render',
  standalone: true,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
})
export class RenderDirective implements OnInit, AfterViewInit, OnDestroy {
  eleRef = inject(ElementRef);
  renderer = inject(Renderer2);

  private readonly observer = new MutationObserver(() => {
    this.setBackground();
  });

  ngOnInit(): void {
    console.log(this.eleRef.nativeElement);
    this.renderer.setStyle(this.eleRef.nativeElement, 'background', 'red');
  }

  ngAfterViewInit(): void {
    this.observer.observe(this.eleRef.nativeElement, {
      attributes: true,
      subtree: false,
      childList: false,
    });
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private setBackground() {
    this.renderer.setStyle(this.eleRef.nativeElement, 'background', 'red');
  }
}
