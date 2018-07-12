import {Component} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';

import {environment} from '../../../environments/environment';
import {AuthService} from "../../services/";

let URL = '/api/upload';
URL = environment.host + URL;

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
	public uploader: FileUploader;
	public hasBaseDropZoneOver: boolean = false;

	constructor(private authService: AuthService) {
		this.uploader = new FileUploader({url: URL, itemAlias: "files", queueLimit: 10, authToken: this.authService.getToken()});
	}

	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}
}
