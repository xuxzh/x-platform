import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';

@Directive({
  selector: '[xpAddText]',
  standalone: true,
})
export class AddTextDirective implements OnInit {
  @Input() xpAddText: string | TemplateRef<any> = '';
  templateRef = inject(TemplateRef);
  viewContainerRef = inject(ViewContainerRef);

  ngOnInit(): void {
    this.viewContainerRef.clear();
    const isTemplateRef = this.xpAddText instanceof TemplateRef;
    this.viewContainerRef.createEmbeddedView(
      (isTemplateRef ? this.xpAddText : this.templateRef) as TemplateRef<any>,
      {
        $implicit: this.xpAddText,
      }
    );
  }
}
