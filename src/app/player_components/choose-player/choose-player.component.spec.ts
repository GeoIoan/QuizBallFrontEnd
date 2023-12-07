import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePlayerComponent } from './choose-player.component';

describe('ChoosePlayerComponent', () => {
  let component: ChoosePlayerComponent;
  let fixture: ComponentFixture<ChoosePlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChoosePlayerComponent]
    });
    fixture = TestBed.createComponent(ChoosePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
