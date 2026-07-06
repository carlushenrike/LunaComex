import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStore } from '../../stores/app.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './tracking.component.html'
})
export class TrackingComponent {
  store = inject(AppStore);
  searchTerm = '';

  search() {
    if (this.searchTerm) {
      this.store.searchCarga(this.searchTerm);
    }
  }
}
