import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-invoice-mirror',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './invoice-mirror.component.html'
})
export class InvoiceMirrorComponent {}
