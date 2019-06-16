import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransactionsModule } from './transactions/transactions.module';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { SimpleNotificationsModule, NotificationAnimationType } from 'angular2-notifications';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TransactionsModule,
    SimpleNotificationsModule.forRoot({
      position: ['top', 'center'],
      animate: NotificationAnimationType.FromTop,
      timeOut: 4000,
      showProgressBar: false,
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
