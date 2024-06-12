import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XEditorComponent } from './editor.component';

describe('EditorComponent', () => {
  let component: XEditorComponent;
  let fixture: ComponentFixture<XEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(XEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
