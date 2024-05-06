import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignerPoolComponent } from './designer-pool.component';

describe('DesignerPoolComponent', () => {
  let component: DesignerPoolComponent;
  let fixture: ComponentFixture<DesignerPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignerPoolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
