import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";

import {
	AboutComponent,
	HomeComponent,
	NoContentComponent,
	LoginComponent,
	RegisterUserComponent,
	ContactComponent,
	UploadComponent,
	FileManagerComponent,
	AdminDashboardComponent
} from './pages/';
import {AdminGuard, AuthGuard} from "./services/";

// So they can be imported in the main module easily
export const routingComponents = [
	AboutComponent,
	HomeComponent,
	NoContentComponent,
	LoginComponent,
	RegisterUserComponent,
	ContactComponent,
	UploadComponent,
	FileManagerComponent,
	AdminDashboardComponent
];

const appRoutes: Routes = [
	{path: '', component: HomeComponent, pathMatch: 'full' },
	{path: 'about', component: AboutComponent},
	{path: 'login', component: LoginComponent},
	{path: 'contact', component: ContactComponent},
	{path: 'register', component: RegisterUserComponent},
	{path: 'upload', component: UploadComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
	{path: 'file-manager', component: FileManagerComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
	{path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard], runGuardsAndResolvers: 'always'},
	{path: '**', component: NoContentComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(appRoutes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}

