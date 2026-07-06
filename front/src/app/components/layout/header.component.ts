import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DuimpStore } from '../../stores/duimp.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IconComponent, DatePipe],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  store = inject(DuimpStore);
  date = Date.now();
}