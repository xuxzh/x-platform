import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  selector: 'xp-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'x-product-platform';
}
