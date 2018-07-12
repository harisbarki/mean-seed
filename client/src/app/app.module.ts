import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FileUploadModule} from 'ng2-file-upload';

import {AppComponent} from './app.component';
import {AppRoutingModule, routingComponents} from './app.routes';
import {
	AuthService,
	AuthInterceptor,
	AuthGuard,
	AdminGuard
} from './services';
import {
	NavbarComponent,
	FooterComponent
} from './components/';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		FooterComponent,
		routingComponents
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		RouterModule,
		AppRoutingModule,
		FileUploadModule,
		ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
	],
	providers: [
		AuthService,
		AuthGuard,
		AdminGuard,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
