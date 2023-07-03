import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDrawerElementsComponent } from './mat-drawer-elements.component';

describe('MatDrawerElementsComponent', () => {
  let component: MatDrawerElementsComponent;
  let fixture: ComponentFixture<MatDrawerElementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatDrawerElementsComponent]
    });
    fixture = TestBed.createComponent(MatDrawerElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
