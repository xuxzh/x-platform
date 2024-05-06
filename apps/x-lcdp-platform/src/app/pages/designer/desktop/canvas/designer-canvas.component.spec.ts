import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignerCanvasComponent } from './designer-canvas.component';

describe('DesignerCanvasComponent', () => {
  let component: DesignerCanvasComponent;
  let fixture: ComponentFixture<DesignerCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignerCanvasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
