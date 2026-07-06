import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './app/components/layout/sidebar.component';
import { DuimpWizardComponent } from './app/components/duimp/duimp-wizard.component';
import { ProductCatalogComponent } from './app/components/catalog/product-catalog.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { LpcoListComponent } from './app/components/lpco/lpco-list.component';
import { TrackingComponent } from './app/components/tracking/tracking.component';
import { NumerarioComponent } from './app/components/numerario/numerario.component';
import { FinancialComponent } from './app/components/financial/financial.component';
import { InternalFinanceComponent } from './app/components/internal-finance/internal-finance.component';
import { InvoiceMirrorComponent } from './app/components/invoice-mirror/invoice-mirror.component';
import { ProcessClosingComponent } from './app/components/process-closing/process-closing.component';
import { AppStore } from './app/stores/app.store';
import { IconComponent } from './app/components/ui/icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    DuimpWizardComponent,
    ProductCatalogComponent,
    DashboardComponent,
    LpcoListComponent,
    TrackingComponent,
    NumerarioComponent,
    FinancialComponent,
    InternalFinanceComponent,
    InvoiceMirrorComponent,
    ProcessClosingComponent,
    IconComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  app = inject(AppStore);
}