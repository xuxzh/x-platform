import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';

type PasswordStrength = 'weak' | 'medium' | 'strong';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[type="password"]',
  standalone: true,
})
export class PwdDirective implements OnInit {
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

  renderer = inject(Renderer2);
  eleRef = inject(ElementRef);

  ngOnInit(): void {
    console.log(this.eleRef.nativeElement);
    this.renderer.addClass(this.eleRef.nativeElement, 'ant-input-disabled');
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
