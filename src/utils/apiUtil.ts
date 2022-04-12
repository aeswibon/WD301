import { formDataChecker, fieldChecker, Submission } from "./../types/form";
import { PaginationParams } from "../types/pagination";
const API_BASE_URL = "https://tsapi.coronasafe.live/api/";
type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const request = async (
	endpoint: string,
	method: RequestMethod = "GET",
	data: any = null,
) => {
	const url = `${API_BASE_URL}${endpoint}${
		method === "GET" && data
			? `?${Object.keys(data)
					.map((key) => `${key}=${data[key]}`)
					.join("&")}`
			: ""
	}`;
	const body = method !== "GET" && data ? JSON.stringify(data) : null;
	const token = localStorage.getItem("token");
	const auth = token ? `Token ${localStorage.getItem("token")}` : "";

	const response = await fetch(url, {
		method,
		headers: {
			"Content-Type": "application/json",
			Authorization: auth,
		},
		body,
	});

	if (response.ok) {
		if (method === "DELETE") {
			return true;
		}
		const json = await response.json();
		return json;
	} else {
		const errorJson = await response.json();
		throw Error(errorJson);
	}
};

export const login = (username: string, password: string) => {
	return request("auth-token/", "POST", { username, password });
};

export const me = () => {
	return request("users/me/", "GET", {});
};

export const createForm = (form: formDataChecker) => {
	return request("forms/", "POST", form);
};

export const listForms = (pageParams: PaginationParams) => {
	return request("forms/", "GET", pageParams);
};

export const getFormData = (formId: number) => {
	return request(`forms/${formId}/`, "GET", {});
};

export const updateFormData = (formId: number, formData: formDataChecker) => {
	return request(`forms/${formId}/`, "PUT", formData);
};

export const deleteFormData = (formId: number, formData: formDataChecker) => {
	return request(`forms/${formId}/`, "DELETE", formData);
};

export const updateFormTitle = (formId: number, title: string) => {
	return request(`forms/${formId}/`, "PATCH", { title });
};

export const getFormFields = (formId: number) => {
	return request(`forms/${formId}/fields/`, "GET", {});
};

export const addField = (formId: number, field: fieldChecker) => {
	return request(`forms/${formId}/fields/`, "POST", field);
};

export const updateField = (
	formId: number,
	fieldId: number,
	field: fieldChecker,
) => {
	return request(`forms/${formId}/fields/${fieldId}/`, "PUT", field);
};

export const removeField = (formId: number, fieldId: number) => {
	return request(`forms/${formId}/fields/${fieldId}/`, "DELETE", {});
};

export const getSubmissions = (formId: number) => {
	return request(`forms/${formId}/submission/`, "GET", {});
};

export const submitAnswers = (formId: number, formAnswer: Submission) => {
	return request(`forms/${formId}/submission/`, "POST", formAnswer);
};

export const getSubmission = (formId: number, submissionId: number) => {
	return request(`forms/${formId}/submission/${submissionId}/`, "GET", {});
};

export const getFormField = (formId: number, fieldId: number) => {
	return request(`forms/${formId}/fields/${fieldId}/`, "GET", {});
};
