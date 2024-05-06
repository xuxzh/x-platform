import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignerConfigComponent } from './designer-config.component';

describe('DesignerConfigComponent', () => {
  let component: DesignerConfigComponent;
  let fixture: ComponentFixture<DesignerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignerConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
