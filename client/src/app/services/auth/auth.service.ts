import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as moment from "moment";
import { BehaviorSubject } from 'rxjs';
import "rxjs/add/operator/do";
import 'rxjs/add/operator/shareReplay';

import {environment} from '../../../environments/environment';
import {User} from './user';
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthService implements OnDestroy {

	private serverUrl = '/api/auth';
	private serviceName = 'AuthService';
	private user;
	private userSource = new BehaviorSubject(this.getUser());
	loggedInUser = this.userSource.asObservable();
	redirectUrl: string;	// if the user went to restricted page without logged in

	private orcidInfo = {
		client_id: "APP-7AF9Y5881IE809X8",
		response_type: "code",
		scope: "/authenticate",
		redirect_uri: window.location.origin + "/RedirectURI"
	};

	getOrcidInfo() {
		return this.orcidInfo;
	}

	urlLinks = {
		login: () => {
			return '/login';
		},
		register: () => {
			return '/register';
		},
		forgot: () => {
			return '/forgot';
		}
	};

	constructor(private http: HttpClient) {
		this.serverUrl = environment.host + this.serverUrl;

		if (window.addEventListener) {
			window.addEventListener("storage", ()=>{
				this.updateLoggedInUser(this.getUser());
			}, false);
		}
	}

	ngOnDestroy() {
		this.userSource.unsubscribe();
	}

	login(email: string, password: string): Observable<any> {
		return this.http.post<User>(`${this.serverUrl}/login`, {email, password})
			.do((res) => {
				this.setSession(res);
			})
			.shareReplay();
	}

	orcidAuthO(code: string): Observable<any> {
		return this.http.post<User>(`${this.serverUrl}/orcid`, {code, redirect_uri: this.orcidInfo.redirect_uri})
			.do((res) => {
				this.setSession(res);
			})
			.shareReplay();
	}

	register(email: string, password: string) {
		return this.http.post<User>(`${this.serverUrl}/register`, {email, password})
			.do((res) => {
				this.setSession(res);
			})
			.shareReplay();
	}

	private setSession(authResult) {
		const expiresAt = moment().add(authResult.expiresIn, 'second');

		localStorage.setItem('id_token', authResult.token);
		localStorage.setItem('user', JSON.stringify(authResult.user));
		localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
		this.updateLoggedInUser(authResult.user);
		this.user = authResult.user;
	}

	private updateLoggedInUser(user) {
		this.userSource.next(user);
	}

	logout() {
		localStorage.removeItem("id_token");
		localStorage.removeItem("user");
		localStorage.removeItem("expires_at");
		this.updateLoggedInUser(null);
		this.user = null;
	}

	public isLoggedIn() {
		return moment().isBefore(this.getExpiration());
	}

	public isLoggedOut() {
		return !this.isLoggedIn();
	}

	getExpiration() {
		const expiration = localStorage.getItem("expires_at");
		const expiresAt = JSON.parse(expiration);
		return moment(expiresAt);
	}

	public isLoggedInUserAdmin() {
		return this.getUser().role === 'Admin';
	}

	getToken() {
		return localStorage.getItem("id_token");
	}

	getUser() {
		const user = localStorage.getItem("user");
		if(user && this.isLoggedIn()) {
			return JSON.parse(user);
		} else {
			this.user = null;
			return null;
		}
	}
}

