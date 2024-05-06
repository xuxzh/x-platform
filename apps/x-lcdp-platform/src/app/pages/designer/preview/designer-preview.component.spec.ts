import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignerPreviewComponent } from './designer-preview.component';

describe('DesignerPreviewComponent', () => {
  let component: DesignerPreviewComponent;
  let fixture: ComponentFixture<DesignerPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignerPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
