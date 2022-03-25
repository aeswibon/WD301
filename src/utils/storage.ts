import { formDataChecker } from "./../types/form";

// to get all the forms from localStorage
export const getLocalForms = (key: string): formDataChecker[] => {
	const localForms = localStorage.getItem(key);
	return localForms ? JSON.parse(localForms) : [];
};

// save the form in localStorage
export const saveLocalForms = (key: string, forms: formDataChecker[]) => {
	localStorage.setItem(key, JSON.stringify(forms));
};

// to initiate the state of the form
export const initialState = (key: string, id: string): formDataChecker => {
	const formData = getLocalForms(key);
	if (formData.length > 0) {
		for (let i = 0; i < formData.length; i++) {
			if (formData[i].id === id) {
				return formData[i];
			}
		}
	}
	const newForm = {
		id: id,
		title: "",
		formFields: [],
	};
	saveLocalForms(key, [...formData, newForm]);
	return newForm;
};

// save the form on each input
export const handleSave = (key: string, field: formDataChecker) => {
	const formData = getLocalForms(key);
	const updateFormData = formData.map((f) => (f.id === field.id ? field : f));
	saveLocalForms(key, updateFormData);
};

export const initialPreviewState = (from: string, to: string, id: string) => {
	const formData = getLocalForms(from);
	const form = formData.find((form) => form.id === id);
	const newForm = {
		id: new Date().getTime().toString(),
		title: form ? form.title : "",
		formFields: form ? form.formFields : [],
	};
	const answerForm = getLocalForms(to);
	saveLocalForms(to, [...answerForm, newForm]);
	return newForm;
};
