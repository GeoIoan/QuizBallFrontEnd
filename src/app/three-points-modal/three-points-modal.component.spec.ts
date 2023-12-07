import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreePointsModalComponent } from './three-points-modal.component';

describe('ThreePointsModalComponent', () => {
  let component: ThreePointsModalComponent;
  let fixture: ComponentFixture<ThreePointsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ThreePointsModalComponent]
    });
    fixture = TestBed.createComponent(ThreePointsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
