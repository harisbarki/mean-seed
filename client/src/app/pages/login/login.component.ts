import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../services';
import {Subscription} from "rxjs/Subscription";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
	loadingData: boolean;
	user: { email: string, password: string };
	errorMessage: string;
	userSubscription: Subscription;

	constructor(private router: Router, private authService: AuthService) {
	}

	ngOnInit() {
		this.user = {email: '', password: ''};
		if (this.authService.isLoggedIn()) {
			this.router.navigateByUrl(this.authService.redirectUrl || '/upload');
			this.authService.redirectUrl = null;
		}

		// on login using anything do this
		this.userSubscription = this.authService.loggedInUser.subscribe(user => {
			if (user) {
				console.log('user logged in, rerouting');
				this.router.navigateByUrl(this.authService.redirectUrl || '/upload');
				this.authService.redirectUrl = null;
			}
		})
	}

	ngOnDestroy() {
		this.userSubscription.unsubscribe();
	}

	login() {
		this.loadingData = true;

		if (this.user.email && this.user.password) {
			this.authService.login(this.user.email, this.user.password).subscribe(
				(data) => {
					console.log("User is logged in", data);
				},
				err => {
					this.errorMessage = err.statusText;
				}
			);
		}
	}

}
