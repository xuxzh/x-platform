import { Directive, OnInit } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'button[nz-button]',
  standalone: true,
})
export class BasicButtonDirective implements OnInit {
  ngOnInit(): void {
    console.log('111');
  }
}
