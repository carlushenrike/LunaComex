import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../stores/app.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-lpco-list',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './lpco-list.component.html'
})
export class LpcoListComponent {
  store = inject(AppStore);
}
