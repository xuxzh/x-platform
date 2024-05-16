import { NgModule } from '@angular/core';
import {
  XDragDropService,
  XJsonSchemaService,
  XJsonDesignerService,
  XToolbarTabsService,
  XKeyboardShortcutService,
} from './services';

@NgModule({
  providers: [
    XDragDropService,
    XJsonSchemaService,
    XJsonDesignerService,
    XToolbarTabsService,
    XKeyboardShortcutService,
  ],
})
export class XLcdpDesignerModule {}
