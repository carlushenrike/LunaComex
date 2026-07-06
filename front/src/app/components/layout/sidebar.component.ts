import { Component, inject } from '@angular/core';
import { AppStore } from '../../stores/app.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  app = inject(AppStore);
}