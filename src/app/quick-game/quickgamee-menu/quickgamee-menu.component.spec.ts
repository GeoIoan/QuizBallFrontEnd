import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickgameeMenuComponent } from './quickgamee-menu.component';

describe('QuickgameeMenuComponent', () => {
  let component: QuickgameeMenuComponent;
  let fixture: ComponentFixture<QuickgameeMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuickgameeMenuComponent]
    });
    fixture = TestBed.createComponent(QuickgameeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
