import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterOutlet} from "@angular/router";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MockBackendInterceptor} from "@core/mock-backend/mock-backend.interceptor";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {UserComponent} from "@features/user/user.component";
import {BaseUrlInterceptor} from "@core/interceptors/base-url.interceptor";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterOutlet,
    NgbModule,
    UserComponent,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
