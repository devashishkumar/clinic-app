import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//*Own Modules
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';
import { AppRoutingModule } from './app-routing.module';
import { appReducers } from './app.reducer';

//*Components
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    PagesModule,
    SharedModule,
    StoreDevtoolsModule.instrument(),
    StoreModule.forRoot(appReducers)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
