import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerOrTeamComponent } from './player-or-team.component';

describe('PlayerOrTeamComponent', () => {
  let component: PlayerOrTeamComponent;
  let fixture: ComponentFixture<PlayerOrTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlayerOrTeamComponent]
    });
    fixture = TestBed.createComponent(PlayerOrTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
