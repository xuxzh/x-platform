import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XDroplistPoolComponent } from './droplist-pool.component';

describe('XDroplistPoolComponent', () => {
  let component: XDroplistPoolComponent;
  let fixture: ComponentFixture<XDroplistPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XDroplistPoolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(XDroplistPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
