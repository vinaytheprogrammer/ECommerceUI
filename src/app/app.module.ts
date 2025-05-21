import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './core/store/app.state';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { metaReducers } from './core/store/auth/auth.meta-reducer';
import { FooterComponent } from './core/footer/footer.component';
import { UnsavedChangesGuard } from './core/guards/unsaved-changes.guard';

@NgModule({
  declarations: [AppComponent, NavbarComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true, // Check if the state is immutable
        strictActionImmutability: true, // Check if the actions are immutable
      },
    }),
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // Use the AuthInterceptor for all HTTP requests for refreshing the token
      multi: true,
    },
    UnsavedChangesGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
