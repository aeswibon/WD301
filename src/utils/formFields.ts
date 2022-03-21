import { formFields } from "../types/form";

const textFormField = (label: string): formFields => {
	return {
		kind: "text",
		id: new Date().getTime().toString(),
		label: label,
		type: "text",
		value: "",
	};
};

const dropdownFormField = (label: string): formFields => {
	return {
		kind: "dropdown",
		id: new Date().getTime().toString(),
		label: label,
		options: [],
		value: "",
	};
};

const radioFormField = (label: string): formFields => {
	return {
		kind: "radio",
		id: new Date().getTime().toString(),
		label: label,
		options: [],
		value: "",
	};
};

const multiselectFormField = (label: string): formFields => {
	return {
		kind: "multiselect",
		id: new Date().getTime().toString(),
		label: label,
		options: [],
		value: "",
	};
};

const fileUploadField = (label: string): formFields => {
	return {
		kind: "file-upload",
		id: new Date().getTime().toString(),
		label: label,
		fileToUpload: null,
		value: "",
	};
};

export const generateFormField = (kind: string, label: string): formFields => {
	switch (kind) {
		case "text":
			return textFormField(label);
		case "dropdown":
			return dropdownFormField(label);
		case "multiselect":
			return multiselectFormField(label);
		case "radio":
			return radioFormField(label);
		default:
			return fileUploadField(label);
	}
};
