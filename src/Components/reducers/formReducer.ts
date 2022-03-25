import { generateFormField } from "./../../utils/formFields";
import { formDataChecker } from "./../../types/form";
import { initialFormField } from "../../types/form";

type AddFieldAction = {
	type: "add_field";
	fieldData: initialFormField;
	callback: () => void;
};

type RemoveFieldAction = {
	type: "remove_field";
	id: string;
};

type UpdateTitleAction = {
	type: "update_title";
	title: string;
};

type UpdateLabelAction = {
	type: "update_label";
	id: string;
	value: string;
};

type UpdateOptionsAction = {
	type: "update_options";
	id: string;
	options: string;
};

type FormAction =
	| AddFieldAction
	| RemoveFieldAction
	| UpdateTitleAction
	| UpdateLabelAction
	| UpdateOptionsAction;

export const formReducer = (
	state: formDataChecker,
	action: FormAction,
): formDataChecker => {
	switch (action.type) {
		case "add_field": {
			const { kind, label } = action.fieldData;

			if (generateFormField(kind, label)) {
				const newFormField = generateFormField(kind, label);
				action.callback();

				return {
					...state,
					formFields: [...state.formFields, newFormField],
				};
			}
			return state;
		}

		case "remove_field": {
			return {
				...state,
				formFields: state.formFields.filter((field) => field.id !== action.id),
			};
		}

		case "update_title": {
			return {
				...state,
				title: action.title,
			};
		}

		case "update_label": {
			const { id, value } = action;
			return {
				...state,
				formFields: state.formFields.map((field) => {
					if (field.id === id) return { ...field, label: value };
					return field;
				}),
			};
		}

		case "update_options": {
			const { id, options } = action;
			const fieldOptions = options.split(",");
			return {
				...state,
				formFields: state.formFields.map((field) => {
					if (field.id === id) return { ...field, options: fieldOptions };
					return field;
				}),
			};
		}

		default:
			return state;
	}
};
