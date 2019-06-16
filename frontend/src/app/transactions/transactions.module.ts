import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { DetailsComponent } from './pages/details/details.component';
import { MainComponent } from './pages/main/main.component';
import { TableComponent } from './components/table/table.component';
import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatCheckboxModule,
  MatInputModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule
} from '@angular/material';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { EditTransactionModalComponent } from './components/edit-transaction-modal/edit-transaction-modal.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TransactionsComponent,
    DetailsComponent,
    MainComponent,
    TableComponent,
    ConfirmComponent,
    EditTransactionModalComponent
  ],
  entryComponents: [
    ConfirmComponent,
    EditTransactionModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TransactionsRoutingModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class TransactionsModule { }
