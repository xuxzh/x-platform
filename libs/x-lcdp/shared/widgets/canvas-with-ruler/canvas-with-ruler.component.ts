import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import Ruler from '@scena/ruler';
import type { RulerProps } from '@scena/ruler';
import { FunctionHelper } from '@x/base/core';
import { WithNil } from '@x/base/model';

@Component({
  selector: 'x-canvas-with-ruler',
  styleUrl: './canvas-with-ruler.component.less',
  templateUrl: './canvas-with-ruler.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class XCanvasWithRulerComponent implements AfterViewInit {
  @ViewChild('horizontalRuler') horizontalRulerRef!: ElementRef;
  @ViewChild('verticalRuler') verticalRulerRef!: ElementRef;

  rulerBackgroundColor = '#f2f2f2';
  commonOption: RulerProps = {
    backgroundColor: this.rulerBackgroundColor,
    textColor: 'black',
  };

  horizontalRuler: WithNil<Ruler>;
  horizontalOption: RulerProps = {
    type: 'horizontal',
    ...this.commonOption,
  };

  verticalRuler: WithNil<Ruler>;
  verticalOption: RulerProps = {
    type: 'vertical',
    ...this.commonOption,
  };

  renderer = inject(Renderer2);
  document = inject(DOCUMENT);

  resizeHandler = FunctionHelper.throttle(() => this.resize(), 100);

  ngAfterViewInit(): void {
    this.horizontalRuler = new Ruler(
      this.horizontalRulerRef.nativeElement,
      this.horizontalOption
    );
    this.verticalRuler = new Ruler(
      this.verticalRulerRef.nativeElement,
      this.verticalOption
    );

    this.renderer.listen(window, 'resize', this.resizeHandler);
  }

  /** 标尺线resize */
  private resize() {
    this.horizontalRuler?.resize();
    this.verticalRuler?.resize();
  }
}
