export interface formFieldChecker {
	id: string;
	label: string;
	type?: string;
	value: string;
}

export interface formDataChecker {
	id: string;
	title: string;
	formFields: formFieldChecker[];
}
