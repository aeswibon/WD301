import { Error } from "../types/pagination";
import { fieldChecker, formDataChecker } from "../types/form";
import { Answer, Submission } from "../types/form";

export type PreviewState = {
	loading: boolean;
	activeIndex: number;
	submission: Submission;
	errors: Error<Answer>[];
};

type InitializePreviewAction = {
	type: "initialize_preview";
	payload: {
		formData: formDataChecker;
		formField: fieldChecker[];
	};
};

type UpdateLoadingAction = {
	type: "update_loading";
	payload: boolean;
};

type UpdateErrorAction = {
	type: "update_error";
	payload: Error<Answer>[];
};

type UpdateActiveIndexAction = {
	type: "update_active_index";
	payload: number;
};

type ResetFieldAction = {
	type: "reset_field";
};

type UpdateAnswerAction = {
	type: "update_answer";
	payload: {
		fieldId: number;
		value: string;
	};
};

export type PreviewAction =
	| InitializePreviewAction
	| UpdateActiveIndexAction
	| ResetFieldAction
	| UpdateAnswerAction
	| UpdateErrorAction
	| UpdateLoadingAction;

export const previewReducer = (
	state: PreviewState,
	action: PreviewAction,
): PreviewState => {
	switch (action.type) {
		case "initialize_preview":
			return {
				...state,
				submission: {
					...state.submission,
					form: action.payload.formData,
					answers: action.payload.formField.map((field) => {
						return {
							form_field: field.id!,
							value: "",
						};
					}),
				},
			};

		case "update_active_index":
			return {
				...state,
				activeIndex: action.payload,
			};

		case "update_answer":
			return {
				...state,
				submission: {
					...state.submission,
					answers: state.submission.answers.map((answer) => {
						return answer.form_field === action.payload.fieldId
							? { ...answer, value: action.payload.value }
							: answer;
					}),
				},
			};

		case "reset_field":
			return {
				...state,
				submission: {
					...state.submission,
					answers: state.submission.answers.map((answer) => ({
						...answer,
						value: "",
					})),
				},
			};

		case "update_error":
			return {
				...state,
				errors: action.payload,
			};

		case "update_loading":
			return {
				...state,
				loading: action.payload,
			};

		default:
			return state;
	}
};
