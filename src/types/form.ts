export type User = {
	username: string;
	name?: string;
	url?: string;
};
export type formDataChecker = {
	id?: number;
	title: string;
	description?: string;
	is_public?: boolean;
	created_by?: number;
	created_date?: Date;
	modified_date?: Date;
};

export type fieldChecker = {
	id?: number;
	label: string;
	kind: "TEXT" | "DROPDOWN" | "RADIO" | "NULL";
	options?: string;
	value?: string;
	meta?: string;
};

export type FormField = FormData & {
	formFields: fieldChecker[];
};

export type PreviewForm = {
	formData: FormData;
	formFields: fieldChecker[];
	activeIndex: number;
};

export type Answer = {
	form_field: number;
	value: string;
};

export type Submission = {
	answers: Answer[];
	id?: number;
	form?: formDataChecker;
	created_date?: Date;
};
