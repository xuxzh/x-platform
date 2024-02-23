import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'xp-preview-layout',
  imports: [RouterOutlet],
  standalone: true,
  template: ` <router-outlet /> `,
})
export class PreviewLayoutComponent {}
