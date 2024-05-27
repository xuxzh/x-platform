import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XBaseCoreModule } from '@x/base/core';

@Component({
  standalone: true,
  imports: [RouterModule, XBaseCoreModule],
  selector: 'xp-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'x-lcdp-platform';
}
