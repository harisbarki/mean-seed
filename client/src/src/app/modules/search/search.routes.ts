import {RouterModule, Routes} from '@angular/router';
import {SearchComponent} from './search.component'

const appRoutes: Routes = [
	{
		path: '', children: [
		{
			path: '', component: SearchComponent
		},
	]
	},
];

export const routes = RouterModule.forChild(appRoutes);
