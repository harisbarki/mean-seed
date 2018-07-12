import {Component} from '@angular/core';
declare let $: any;

import {FileManager, FileManagerService} from '../../services';

@Component({
	selector: 'app-file-manager',
	templateUrl: './file-manager.component.html',
	styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent {

	files: FileManager[];
	expandedFile: FileManager;

	constructor(private fileManagerService: FileManagerService) {
		this.fileManagerService.getAllFiles().then((files: FileManager[]) => {
			this.files = files;

			console.log(files[0]);
		});
	}

	showFileModel(file: FileManager) {
		this.expandedFile = file;
		$('#fileModal').modal();
	}
}
