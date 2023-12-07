import { Component, OnInit, Inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule} from '@angular/material/dialog';


@Component({
  selector: 'app-three-points-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './three-points-modal.component.html',
  styleUrls: ['./three-points-modal.component.css']
})
export class ThreePointsModalComponent {
dialogRef: any;

}
