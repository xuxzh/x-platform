import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NestedDroplistPoolComponent } from './nested-droplist-pool.component';

describe('NestedDroplistPoolComponent', () => {
  let component: NestedDroplistPoolComponent;
  let fixture: ComponentFixture<NestedDroplistPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedDroplistPoolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NestedDroplistPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
