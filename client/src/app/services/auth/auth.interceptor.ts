import {Injectable} from "@angular/core";
import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	intercept(req: HttpRequest<any>,
			  next: HttpHandler): Observable<HttpEvent<any>> {

		const idToken = localStorage.getItem("id_token");

		if (idToken) {
			const cloned = req.clone({
				headers: req.headers.set("Authorization", idToken)
			});

			return next.handle(cloned);
		}
		else {
			return next.handle(req);
		}
	}
}
