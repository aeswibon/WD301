import { fieldChecker, formDataChecker } from "./../types/form";
import { Error } from "../types/pagination";

export const validateForm = (form: formDataChecker) => {
	const errors: Error<formDataChecker> = {};
	if (form.title.length < 1) {
		errors.title = "Title is required";
	}
	if (form.title.length > 100) {
		errors.title = "Title must be less than 100 characters";
	}

	return errors;
};

export const validateFormField = (field: fieldChecker) => {
	const errors: Error<fieldChecker> = {};
	if (field.label.length < 1) {
		errors.label = "Label is required";
	}
	if (field.label.length > 100) {
		errors.label = "Label must be less than 100 characters";
	}
	return errors;
};
