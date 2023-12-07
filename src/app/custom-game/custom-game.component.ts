import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-custom-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './custom-game.component.html',
  styleUrls: ['./custom-game.component.css']
})
export class CustomGameComponent {

}
