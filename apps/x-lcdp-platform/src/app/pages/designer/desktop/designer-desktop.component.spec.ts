import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignerDesktopComponent } from './designer-desktop.component';

describe('DesignerComponent', () => {
  let component: DesignerDesktopComponent;
  let fixture: ComponentFixture<DesignerDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignerDesktopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
