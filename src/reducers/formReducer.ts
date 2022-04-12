import { fieldChecker } from "../types/form";

export type FormReducerState = {
	loading: boolean;
	formFields: fieldChecker[];
};

type SetFieldsAction = {
	type: "set_form_fields";
	payload: fieldChecker[];
};

type AddFieldAction = {
	type: "add_form_field";
	payload: fieldChecker;
};

type RemoveFieldAction = {
	type: "remove_field";
	fieldId: number;
};

type UpdateLoadingAction = {
	type: "update_loading";
	payload: boolean;
};

export type FormReducerAction =
	| SetFieldsAction
	| AddFieldAction
	| RemoveFieldAction
	| UpdateLoadingAction;

export const formReducer = (
	state: FormReducerState,
	action: FormReducerAction,
) => {
	switch (action.type) {
		case "set_form_fields":
			return {
				...state,
				formFields: action.payload,
			};

		case "add_form_field":
			return {
				...state,
				formFields: [...state.formFields, action.payload],
			};

		case "update_loading":
			return {
				...state,
				loading: action.payload,
			};

		case "remove_field":
			return {
				...state,
				formFields: state.formFields.filter((field) => field.id !== action.fieldId),
			};
	}
};
