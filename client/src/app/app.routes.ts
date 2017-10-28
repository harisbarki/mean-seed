import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";

import {AboutComponent, HomeComponent, NoContentComponent, LoginComponent} from './pages/'

const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'about', component: AboutComponent},
	{path: 'login', component: LoginComponent},
	{path: 'search', loadChildren: './modules/search/search.module#SearchModule'},
	{path: '**', component: NoContentComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(appRoutes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}

// So they can be imported in the main module easily
export const routingComponents = [AboutComponent, HomeComponent, NoContentComponent, LoginComponent];
