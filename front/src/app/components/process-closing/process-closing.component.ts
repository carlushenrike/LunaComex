import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-process-closing',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './process-closing.component.html'
})
export class ProcessClosingComponent {}
