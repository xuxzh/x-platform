import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'xp-exception-403',
  standalone: true,
  imports: [CommonModule],
  template: ` <span></span> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Exception403Component {}
