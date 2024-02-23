import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'xp-designer-layout',
  imports: [RouterOutlet],
  standalone: true,
  template: ` <router-outlet /> `,
})
export class DesignerLayoutComponent {}
