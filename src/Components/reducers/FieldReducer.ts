import { initialFormField } from "./../../types/form";

type UpdateLabelAction = {
	type: "update_label";
	value: string;
};

type UpdateFieldKindAction = {
	type: "update_field_kind";
	value: string;
};

type UpdateOptionsAction = {
	type: "update_options";
	options: string;
};

type ClearFieldAction = {
	type: "clear_field";
};

type NewFieldActions =
	| UpdateLabelAction
	| UpdateFieldKindAction
	| UpdateOptionsAction
	| ClearFieldAction;

export const NewFieldReducer = (
	state: initialFormField,
	action: NewFieldActions,
): initialFormField => {
	switch (action.type) {
		case "update_label": {
			return {
				...state,
				label: action.value,
			};
		}

		case "update_field_kind": {
			return {
				...state,
				kind: action.value,
			};
		}

		case "update_options": {
			return {
				...state,
				options: action.options,
			};
		}

		case "clear_field": {
			return {
				label: "",
				kind: "",
				type: "text",
				options: "",
				fileToUpload: null,
			};
		}

		default:
			return state;
	}
};
