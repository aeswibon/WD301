import React from "react";
import { Link, navigate } from "raviger";
import {
	getFormData,
	getFormField,
	getFormFields,
	me,
	submitAnswers,
} from "../utils/apiUtil";
import {
	PreviewAction,
	previewReducer,
	PreviewState,
} from "../reducers/previewReducer";

import { Error, Pagination } from "../types/pagination";

import Loading from "./Loading";
import { validatePreviewForm } from "../utils/previewFields";
import { Answer, fieldChecker, formDataChecker, User } from "../types/form";
import DropdownInput from "./inputs/DropdownInput";
import RadioInput from "./inputs/RadioInput";
import MultiselectInput from "./inputs/MultiselectInput";

interface PreviewFormFieldInterface {
	total: number;
	error: Error<Answer>[];
	formId: number;
	activeIndex: number;
	answerField: Answer;
	updateAnswerCB: (fieldId: number, value: string) => void;
}

const fetchFormField = async (
	formId: number,
	fieldId: number,
	setField: React.Dispatch<React.SetStateAction<fieldChecker>>,
) => {
	try {
		const data = await getFormField(formId, fieldId);
		setField(data);
	} catch (error) {
		console.log(error);
	}
};

export default function PreviewFormField(props: PreviewFormFieldInterface) {
	const { formId, total, error, activeIndex, answerField, updateAnswerCB } =
		props;
	const [field, setField] = React.useState<fieldChecker>({
		label: "",
		kind: "NULL",
	});

	React.useEffect(() => {
		fetchFormField(formId, answerField.form_field, setField);
	}, [answerField.form_field, formId]);

	const getError = () => {
		const fieldError = error.find(
			(e) => Number(e.form_field) === answerField.form_field,
		);
		return fieldError?.value ? fieldError.value : "";
	};

	return (
		<div>
			<p className="text-right">
				Currently on {activeIndex + 1}/{total}
			</p>
			{field.kind === "DROPDOWN" && (
				<DropdownInput
					field={field}
					error={getError()}
					answer={answerField.value}
					changeValueCB={updateAnswerCB}
				/>
			)}
			{field.kind === "RADIO" && (
				<RadioInput
					field={field}
					error={getError()}
					answer={answerField.value}
					changeValueCB={updateAnswerCB}
				/>
			)}

			{field.meta === "multiselect" && (
				<MultiselectInput
					field={field}
					error={getError()}
					options={answerField.value}
					changeValueCB={updateAnswerCB}
				/>
			)}

			{field.meta === "textarea" && (
				<TextareaInput
					field={field}
					error={getError()}
					answer={answerField.value}
					changeValueCB={updateAnswerCB}
				/>
			)}

			{field.meta === "rating" && (
				<RatingInput
					field={field}
					error={getError()}
					answer={answerField.value}
					changeValueCB={updateAnswerCB}
				/>
			)}
		</div>
	);
}

const initialPreviewState: PreviewState = {
	loading: false,
	activeIndex: 0,
	submission: {
		answers: [],
	},
	errors: [],
};

const initializePreviewState = async (
	formId: number,
	dispatch: React.Dispatch<PreviewAction>,
) => {
	try {
		dispatch({
			type: "update_loading",
			payload: true,
		});

		const formData: formDataChecker = await getFormData(formId);
		const formFieldsData: Pagination<fieldChecker> = await getFormFields(formId);

		dispatch({
			type: "initialize_preview",
			payload: {
				formData: formData,
				formField: formFieldsData.results,
			},
		});
	} catch (error) {
		console.log(error);
	} finally {
		dispatch({
			type: "update_loading",
			payload: false,
		});
	}
};

const Preview = (props: { formId: number }) => {
	const [preview, dispatch] = React.useReducer(
		previewReducer,
		initialPreviewState,
	);

	React.useEffect(() => {
		const authenticateUser = async () => {
			const user: User = await me();
			if (user.username.length < 1) {
				alert("You must be logged in to fill this form");
				navigate("/login");
			}
			document.title = "Form Preview";
		};
		authenticateUser();
	}, []);

	React.useEffect(() => {
		initializePreviewState(props.formId, dispatch);
	}, [props.formId]);

	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		const errors = validatePreviewForm(preview.submission.answers);
		dispatch({
			type: "update_error",
			payload: errors,
		});
		let hasError: boolean = false;

		errors.forEach((error) => {
			if (!error.value) {
				hasError = true;
				return;
			}
		});

		if (!hasError) {
			try {
				await submitAnswers(props.formId, preview.submission);
				alert("Submission successful");
				navigate(`/preview/${props.formId}`);
			} catch (error) {
				console.log("Error occurred while submitting the answers!!", error);
			}
		}
	};

	return (
		<div>
			{preview.loading && <Loading />}
			<div className="py-2 w-full flex flex-col items-center">
				<h2 className="text-xl font-semibold">{preview.submission.form?.title}</h2>
				<p>This form contains {preview.submission.answers.length} questions</p>
			</div>
			<form
				onSubmit={handleSubmit}
				className="max-w-[400px] w-full mx-auto rounded-lg shadow-lg bg-gray-100 p-5 my-3">
				{preview.submission.answers.map(
					(field, index) =>
						preview.activeIndex === index && (
							<PreviewFormField
								key={field.form_field}
								error={preview.errors}
								answerField={field}
								formId={props.formId}
								activeIndex={preview.activeIndex}
								total={preview.submission.answers.length}
								updateAnswerCB={(fieldId: number, value: string) =>
									dispatch({
										type: "update_answer",
										payload: {
											fieldId,
											value,
										},
									})
								}
							/>
						),
				)}

				<BackAndForthNav
					activeIndex={preview.activeIndex}
					total={preview.submission.answers.length}
					updateActiveIndexCB={(index: number) =>
						dispatch({
							type: "update_active_index",
							payload: index,
						})
					}
				/>

				{preview.activeIndex === preview.submission.answers.length - 1 && (
					<button
						type="submit"
						className="px-6 py-1 bg-gray-400 rounded-lg font-semibold text-lg mt-8 hover:shadow-lg">
						Submit
					</button>
				)}
			</form>

			<div className="py-4 mt-4 flex justify-center items-center w-full">
				<Link
					href={`/preview/${props.formId}`}
					className="px-6 py-1 bg-blue-400 text-white rounded-lg font-semibold text-lg shadow-sm border-2 border-blue-400 mr-2 hover:bg-white hover:text-blue-400">
					Go Back
				</Link>
				<button
					type="button"
					onClick={() => {
						dispatch({
							type: "reset_field",
						});
					}}
					className="px-6 py-1 rounded-lg border-blue-400 text-blue-400 border-2 font-semibold ml-2 text-lg shadow-sm hover:bg-blue-400 hover:text-white">
					Reset Answers
				</button>
			</div>
		</div>
	);
};
