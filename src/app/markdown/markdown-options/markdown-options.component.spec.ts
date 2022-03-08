import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownOptionsComponent } from './markdown-options.component';

describe('MarkdownOptionsComponent', () => {
  let component: MarkdownOptionsComponent;
  let fixture: ComponentFixture<MarkdownOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkdownOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
