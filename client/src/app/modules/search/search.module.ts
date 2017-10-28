import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {SearchComponent} from './search.component';
import {SearchRoutingModule, routingComponents} from './search.routes';

console.log('lazy loaded');

@NgModule({
	declarations: [
		SearchComponent,
		routingComponents
	],
	imports: [
		CommonModule,
		FormsModule,
		HttpModule,
		SearchRoutingModule
	],
	providers: [],
	bootstrap: [SearchComponent]
})
export class SearchModule {
}
