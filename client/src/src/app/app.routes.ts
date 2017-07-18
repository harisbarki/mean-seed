import {RouterModule, Routes} from '@angular/router';
import {AboutComponent, HomeComponent, NoContentComponent, LoginComponent} from './components/'

const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'about', component: AboutComponent},
	{path: 'login', component: LoginComponent},
	{path: 'search', loadChildren: './modules/search/search.module#SearchModule'},
	{path: '**', component: NoContentComponent}
];

export const routes = RouterModule.forRoot(appRoutes);
