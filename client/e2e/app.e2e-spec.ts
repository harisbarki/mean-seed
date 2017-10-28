import {MySolPage} from './app.po';

describe('my-sol App', () => {
	let page: MySolPage;

	beforeEach(() => {
		page = new MySolPage();
	});

	it('should display message saying app works', () => {
		page.navigateTo();
		expect(page.getParagraphText()).toEqual('app works!');
	});
});
