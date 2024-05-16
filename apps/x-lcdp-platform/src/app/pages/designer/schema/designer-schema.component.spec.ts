import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignerSchemaComponent } from './designer-schema.component';

describe('DesignerSchemaComponent', () => {
  let component: DesignerSchemaComponent;
  let fixture: ComponentFixture<DesignerSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignerSchemaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
