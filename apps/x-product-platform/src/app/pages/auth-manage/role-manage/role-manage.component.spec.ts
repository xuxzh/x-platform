import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleManageComponent } from './role-manage.component';

describe('RoleManageComponent', () => {
  let component: RoleManageComponent;
  let fixture: ComponentFixture<RoleManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleManageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
