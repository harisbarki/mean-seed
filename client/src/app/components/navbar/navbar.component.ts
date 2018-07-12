import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

	user: string;
	isUserAdmin: boolean;
	userSubscription: Subscription;

	constructor(private router: Router, private authService: AuthService) {
	}

	ngOnInit() {
		this.userSubscription = this.authService.loggedInUser.subscribe(user => {
			this.user = user;
			this.isUserAdmin = user && this.authService.isLoggedInUserAdmin();
		})
	}

	ngOnDestroy() {
		this.userSubscription.unsubscribe();
	}

	logout() {
		this.authService.logout();
		this.router.navigateByUrl('/');
	}

}
