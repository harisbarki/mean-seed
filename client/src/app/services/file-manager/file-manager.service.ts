import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import {environment} from '../../../environments/environment';
import {FileManager} from './file-manager';
import {DataResponse} from '../data-response';

// todo convert to observable from promise

@Injectable()
export class FileManagerService {

	private serverUrl: string = '/api/file-manager';
	private serviceName: string = 'FileManagerService';

	urlLinks = {};

	constructor(private http: HttpClient) {
		this.serverUrl = environment.host + this.serverUrl;
	}

	getAllFiles() {
		return this.http.get<DataResponse<FileManager[]>>(`${this.serverUrl}`)
			.toPromise()
			.then(
				response => {
					const objectReceived = response;
					console.log(this.serviceName, 'getMessage::success', objectReceived);
					return objectReceived.data;
				},
				error => {
					console.error(this.serviceName, 'getMessage::errorCallback', error);
					throw error.json();
				}
			);
	};

}

