import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'xp-register-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-result.component.html',
  styleUrl: './register-result.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterResultComponent {}
