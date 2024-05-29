import {
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  ViewContainerRef,
  inject,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[nz-input]',
  standalone: true,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.x-input-disabled]': `readonly===true||readonly===''`,
  },
})
export class ReadonlyInputDirective implements OnInit {
  // @Input() readonly?: boolean | string;
  eleRef = inject(ElementRef);
  viewContainerRef = inject(ViewContainerRef);
  renderer = inject(Renderer2);
  ngOnInit(): void {
    console.log(this.eleRef.nativeElement);
    // console.log(this.readonly);
    this.renderer.addClass(this.eleRef.nativeElement, 'ant-input-disabled');
  }
}
