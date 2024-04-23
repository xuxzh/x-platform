import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  inject,
} from '@angular/core';

type PasswordStrength = 'weak' | 'medium' | 'strong';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[type="password"]',
  standalone: true,
})
export class PwdDirective {
  @Input() noStrengthCheck = false;
  private readonly el = inject(ElementRef);

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    if (this.noStrengthCheck) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const strength = this.evaluatePasswordStrength(value);
    this.el.nativeElement.classList.add(`pwd-strength-${strength}`);
  }

  evaluatePasswordStrength(pwd: string): PasswordStrength {
    if (pwd.length < 6) {
      return 'weak';
    }
    if (pwd.length < 10) {
      return 'medium';
    }
    return 'strong';
  }
}
