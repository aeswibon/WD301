import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, navigate } from "raviger";
import React from "react";
import { formDataChecker } from "../interfaces/form";
import { getLocalForms } from "../utils/form";

const findForm = (formId: string): formDataChecker => {
	const forms = getLocalForms();
	const form = forms.find((form) => form.id === formId);
	if (!form || form === undefined) {
		navigate("/");
	} else {
		return form;
	}
	return forms[0];
};

const getInitialState = (formId: string, questionId: number) => {
	const form = findForm(formId);
	let question;
	if (questionId && form.formFields.length > questionId) {
		question = form.formFields[questionId];
	} else {
		question = form.formFields[0];
	}
	return {
		form,
		questionId,
		question,
	};
};

const getInitialAnswerState = (form: formDataChecker) => {
	const answers: string[] = [];
	form.formFields.forEach((field, idx) => {
		answers[idx] = "";
	});
	return answers;
};
const PreviewForm = (props: { formId: string }): JSX.Element => {
	const [state, setState] = React.useState(getInitialState(props.formId, 0));
	const { form, question } = state;
	const [questionId, setQuestionId] = React.useState(state.questionId);
	const [answers, setAnswers] = React.useState(getInitialAnswerState(form));

	React.useEffect(() => {
		setState(getInitialState(props.formId, questionId));
	}, [props.formId, questionId]);

	return (
		<div className="flex flex-col flex-1">
			<div className="flex w-full my-3 justify-between">
				<h2 className="text-3xl font-semibold">Preview</h2>
			</div>
			<div className="flex flex-col">
				<div>
					<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
						{question?.label}
					</label>
					<input
						className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
						id={question?.id}
						name={question?.label}
						placeholder={question?.label}
						value={answers[questionId]}
						onChange={(e) => {
							setAnswers({ ...answers, [questionId]: e.target.value });
						}}
					/>
				</div>
				<div className="flex justify-end w-full gap-2">
					{questionId > 0 && (
						<button
							type="button"
							className="bg-blue-500 text-white font-bold py-2 px-4 my-4 rounded"
							onClick={() =>
								questionId > 0 && setQuestionId((questionId) => questionId - 1)
							}>
							<FontAwesomeIcon icon={faArrowLeft} /> Previous
						</button>
					)}
					{questionId < form.formFields.length - 1 && (
						<button
							onClick={() =>
								questionId < form.formFields.length - 1 &&
								setQuestionId((questionId) => questionId + 1)
							}
							className="bg-rose-500 text-white font-bold py-2 px-4 my-4 rounded">
							Next <FontAwesomeIcon icon={faArrowRight} />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default PreviewForm;
