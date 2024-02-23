import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'xp-exception-404',
  standalone: true,
  imports: [CommonModule],
  template: ` <span></span> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Exception404Component {}
