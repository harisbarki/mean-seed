export class FileManager {
	_id: string;
	fileInformation: FileInformation;
	filesCML: FileInformation[];
	createdAt: Date;
	modifiedAt: Date;

	constructor(fileManager: FileManager = {} as FileManager) {
		this._id = fileManager._id;
		this.fileInformation = fileManager.fileInformation;
		this.filesCML = fileManager.filesCML;
		this.createdAt = new Date(fileManager.createdAt);
		this.modifiedAt = new Date(fileManager.modifiedAt);
	}
}

class FileInformation {
	originalFileName: string;
	storedFileName: string;
	storedPath: string;
	size: number;
	sizeType: string;
	fileType: string;
	processedMolecule: string;
	statusCode: number;
	statusMessage: string;

	constructor(fileInformation: FileInformation = {} as FileInformation) {
		this.originalFileName = fileInformation.originalFileName;
		this.storedFileName = fileInformation.storedFileName;
		this.storedPath = fileInformation.storedPath;
		this.size = fileInformation.size;
		this.sizeType = fileInformation.sizeType;
		this.fileType = fileInformation.fileType;
		this.processedMolecule = fileInformation.processedMolecule;
		this.statusCode = fileInformation.statusCode;
		this.statusMessage = fileInformation.statusMessage;
	}
}
