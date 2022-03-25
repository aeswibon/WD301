import { previewForm } from "./../../types/form";

type UpdateAnswerAction = {
	type: "update_answer";
	id: string;
	value: string;
	fileToUpload?: File | null;
};

type ResetAnswerAction = {
	type: "reset_answer";
};

type UpdateActiveIndexAction = {
	type: "update_active_index";
	curr_idx: number;
};

type PreviewAction =
	| UpdateAnswerAction
	| ResetAnswerAction
	| UpdateActiveIndexAction;

export const previewReducer = (
	state: previewForm,
	action: PreviewAction,
): previewForm => {
	switch (action.type) {
		case "update_answer": {
			return {
				...state,
				formAnswers: {
					...state.formAnswers,
					formFields: state.formAnswers.formFields.map((field) => {
						if (field.id === action.id)
							return {
								...field,
								value: action.value,
								fileToUpload: action.fileToUpload ? action.fileToUpload : null,
							};
						return field;
					}),
				},
			};
		}

		case "reset_answer": {
			return {
				...state,
				formAnswers: {
					...state.formAnswers,
					formFields: state.formAnswers.formFields.map((field) => {
						return { ...field, value: "" };
					}),
				},
			};
		}

		case "update_active_index": {
			return {
				...state,
				activeIndex: action.curr_idx,
			};
		}
	}
};
