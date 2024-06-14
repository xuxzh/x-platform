import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicDivComponent } from './basic-div.component';

describe('BasicDivComponent', () => {
  let component: BasicDivComponent;
  let fixture: ComponentFixture<BasicDivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicDivComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
