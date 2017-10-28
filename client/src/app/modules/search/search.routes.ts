import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";

import {SearchComponent} from './search.component';
import {SearchPageComponent} from './pages/';

const searchRoutes: Routes = [
	{
		path: '',
		component: SearchComponent,
		children: [
		{
			path: '', component: SearchPageComponent
		},
	]
	},
];

@NgModule({
	imports: [RouterModule.forChild(searchRoutes)],
	exports: [RouterModule]
})
export class SearchRoutingModule {
}

// So they can be imported in the main module easily
export const routingComponents = [SearchPageComponent];

