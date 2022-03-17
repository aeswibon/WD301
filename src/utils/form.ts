import { formDataChecker } from "../interfaces/form";

// to get all the forms from localStorage
export const getLocalForms = (): formDataChecker[] => {
	const localForms = localStorage.getItem("formData");
	return localForms ? JSON.parse(localForms) : [];
};

// save the form in localStorage
export const saveLocalForms = (forms: formDataChecker[]) => {
	localStorage.setItem("formData", JSON.stringify(forms));
};

// to initiate the state of the form
export const initialState = (id: string): formDataChecker => {
	const formData = getLocalForms();
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
	saveLocalForms([...formData, newForm]);
	return newForm;
};

// save the form on each input
export const handleSave = (field: formDataChecker) => {
	const formData = getLocalForms();
	const updateFormData = formData.map((f) => {
		if (f.id === field.id) {
			return field;
		}
		return f;
	});
	saveLocalForms(updateFormData);
};
