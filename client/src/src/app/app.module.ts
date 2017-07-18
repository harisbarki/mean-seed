import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AboutComponent, HomeComponent, NavbarComponent, NoContentComponent, LoginComponent} from './components/';
import {routes} from './app.routes';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		AboutComponent,
		NavbarComponent,
		LoginComponent,
		NoContentComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		routes
	],
	providers: [
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
