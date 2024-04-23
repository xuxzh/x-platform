import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwdDirective, DivClassDirective } from '@shared';

@Component({
  selector: 'xp-directive-demo',
  standalone: true,
  imports: [CommonModule, PwdDirective, DivClassDirective],
  templateUrl: './directive-demo.component.html',
  styleUrl: './directive-demo.component.less',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    role: 'menuitem',
  },
})
export class DirectiveDemoComponent {}
