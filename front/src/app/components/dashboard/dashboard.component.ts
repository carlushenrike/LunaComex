import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../stores/app.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  store = inject(AppStore);
}
