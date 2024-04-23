import { Directive, ElementRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'div.highlight',
  standalone: true,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '(mouseenter)': 'onMouseEnter($event)',
  },
})
export class DivClassDirective {
  constructor(public el: ElementRef) {}
  onMouseEnter($event: MouseEvent) {
    console.log($event);
    console.log(this.el.nativeElement);
  }
}
