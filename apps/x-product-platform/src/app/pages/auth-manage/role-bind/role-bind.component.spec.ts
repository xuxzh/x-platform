import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleBindComponent } from './role-bind.component';

describe('RoleBindComponent', () => {
  let component: RoleBindComponent;
  let fixture: ComponentFixture<RoleBindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleBindComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleBindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
