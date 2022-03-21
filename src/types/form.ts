export type fieldType = "text" | "radio" | "dropdown";

export type BasicField = {
	id: string;
	label: string;
	value: string;
	fileToUpload?: File | null;
};

type RadioField = BasicField & {
	kind: "radio";
	options: string[];
};

type TextField = BasicField & {
	kind: "text";
	type: "text";
};

type DropdownField = BasicField & {
	kind: "dropdown";
	options: string[];
};

type MultiSelectField = BasicField & {
	kind: "multiselect";
	options: string[];
};

type FileUpload = BasicField & {
	kind: "file-upload";
};

export type formFields =
	| RadioField
	| TextField
	| DropdownField
	| MultiSelectField
	| FileUpload;

export type formDataChecker = {
	id: string;
	title: string;
	formFields: formFields[];
};
