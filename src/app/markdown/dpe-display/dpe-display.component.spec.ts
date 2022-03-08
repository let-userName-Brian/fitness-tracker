import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpeDisplayComponent } from './dpe-display.component';

describe('DpeDisplayComponent', () => {
  let component: DpeDisplayComponent;
  let fixture: ComponentFixture<DpeDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpeDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DpeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
