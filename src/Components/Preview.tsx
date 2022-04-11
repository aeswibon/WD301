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
import TextInput from "./inputs/TextInput";
import FileInput from "./inputs/FileInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface PreviewFormFieldInterface {
	error: Error<Answer>[];
	formId: number;
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

const PreviewFormField = (props: PreviewFormFieldInterface) => {
	const { formId, error, answerField, updateAnswerCB } = props;
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
			{field.kind === "TEXT" && (
				<TextInput
					field={field}
					error={getError()}
					answer={answerField.value}
					changeValueCB={updateAnswerCB}
				/>
			)}
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
					answer={answerField.value}
					changeValueCB={updateAnswerCB}
				/>
			)}
			{field.meta === "file-upload" && (
				<FileInput
					field={field}
					error={getError()}
					answer={answerField.value}
					changeValueCB={updateAnswerCB}
				/>
			)}
		</div>
	);
};

interface NavProps {
	activeIndex: number;
	total: number;
	updateActiveIndexCB: (index: number) => void;
}

const Nav = (props: NavProps) => {
	const { activeIndex, total, updateActiveIndexCB } = props;

	const nextField = () => {
		let currentIndex = activeIndex;
		currentIndex = currentIndex >= total - 2 ? total - 1 : currentIndex + 1;
		updateActiveIndexCB(currentIndex);
	};

	const previousField = () => {
		let currentIndex = activeIndex;
		currentIndex = currentIndex <= 1 ? 0 : currentIndex - 1;
		updateActiveIndexCB(currentIndex);
	};

	const nextButton = () => {
		if (activeIndex < total - 1) {
			return (
				<button
					type="button"
					className="bg-rose-500 text-white font-bold py-2 px-4 my-4 rounded"
					onClick={nextField}>
					Next <FontAwesomeIcon icon={faArrowRight} />
				</button>
			);
		}
		return null;
	};

	const previousButton = () => {
		if (activeIndex > 0) {
			return (
				<button
					type="button"
					className="bg-blue-500 text-white font-bold py-2 px-4 my-4 rounded"
					onClick={previousField}>
					<FontAwesomeIcon icon={faArrowLeft} /> Previous
				</button>
			);
		}
		return null;
	};

	return (
		<>
			{previousButton()}
			{nextButton()}
		</>
	);
};

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

	const handleSubmit = async () => {
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
		<>
			{preview.loading && <Loading />}
			<div className="flex flex-col">
				<div className="flex my-3 justify-between">
					<h2 className="text-3xl font-semibold">
						{preview.submission.form?.title}
					</h2>
					<span>
						Question {preview.activeIndex + 1}/{preview.submission.answers.length}
					</span>
				</div>
			</div>
			<div className="flex flex-col">
				{preview.submission.answers.map(
					(field, index) =>
						preview.activeIndex === index && (
							<PreviewFormField
								key={field.form_field}
								error={preview.errors}
								answerField={field}
								formId={props.formId}
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
				<div className="flex justify-end w-full gap-2">
					<Nav
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
							onClick={handleSubmit}
							className="bg-rose-500 text-white font-bold py-2 px-4 my-4 rounded">
							Submit
						</button>
					)}
				</div>
			</div>

			<div className="flex gap-4 justify-center mt-8">
				<Link
					href={`/preview/${props.formId}`}
					className="bg-blue-500 px-4 py-3 rounded-lg text-white font-semibold">
					Close form
				</Link>
				<button
					type="button"
					onClick={() => {
						dispatch({
							type: "reset_field",
						});
					}}
					className="bg-blue-500 px-4 py-3 rounded-lg text-white font-semibold">
					Reset Answer
				</button>
			</div>
		</>
	);
};

export default Preview;
