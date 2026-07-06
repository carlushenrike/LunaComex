import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../layout/header.component';
import { StepCoverComponent } from './step-cover.component';
import { StepCargoComponent } from './step-cargo.component';
import { StepDocumentsComponent } from './step-documents.component';
import { StepItemsComponent } from './step-items.component';
import { StepPaymentsComponent } from './step-payments.component';
import { DuimpStore } from '../../stores/duimp.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-duimp-wizard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    StepCoverComponent,
    StepCargoComponent,
    StepDocumentsComponent,
    StepItemsComponent,
    StepPaymentsComponent,
    IconComponent
  ],
  templateUrl: './duimp-wizard.component.html'
})
export class DuimpWizardComponent {
  store = inject(DuimpStore);
}