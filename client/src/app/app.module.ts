import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {NavbarComponent} from './components/';
import {AppRoutingModule, routingComponents} from './app.routes';

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		routingComponents
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		AppRoutingModule
	],
	providers: [
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
