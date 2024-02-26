import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'xp-main-frame',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-frame.component.html',
  styleUrl: './main-frame.component.less',
})
export class MainFrameComponent {}
