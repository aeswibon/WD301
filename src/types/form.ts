type RadioField = {
	kind: "radio";
	id: string;
	label: string;
	type: "radio";
	value: string;
};

type TextField = {
	kind: "text";
	id: string;
	label: string;
	type: "text";
	value: string;
};

type DropdownField = {
	kind: "dropdown";
	id: string;
	label: string;
	options: string[];
	value: string;
};

export type formFields = RadioField | TextField | DropdownField;
export type formDataChecker = {
	id: string;
	title: string;
	formFields: formFields[];
};
