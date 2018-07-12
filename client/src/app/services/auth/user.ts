export class User {
	_id: string;
	token: string;
	email: string;
	name: string;
	phone: string;
	address: string;
	city: string;
	country: string;
	postalCode: string;
	password?: string;
	role: string;
	isVerified: boolean;
	isEnabled: boolean;
	incorrectLoginTries: number;
	securityQuestions: SecurityQuestion[];
	lastActiveAt: Date;
	createdAt: Date;
	modifiedAt: Date;

	constructor(user: User = {} as User) {
		this._id = user._id;
		this.token = user.token;
		this.email = user.email;
		this.name = user.name;
		this.phone = user.phone;
		this.address = user.address;
		this.city = user.city;
		this.country = user.country;
		this.postalCode = user.postalCode;
		this.role = user.role;
		this.isVerified = user.isVerified;
		this.isEnabled = user.isEnabled;
		this.incorrectLoginTries = user.incorrectLoginTries;
		this.lastActiveAt = new Date(user.lastActiveAt);
		this.createdAt = new Date(user.createdAt);
		this.modifiedAt = new Date(user.modifiedAt);
	}
}

class SecurityQuestion {
	question: string;
	answer: string;

	constructor(securityQuestion: SecurityQuestion = {} as SecurityQuestion) {
		this.question = securityQuestion.question;
		this.answer = securityQuestion.answer;
	}
}
