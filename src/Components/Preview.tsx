import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { navigate } from "raviger";
import React from "react";
import { formDataChecker } from "../types/form";
import { getLocalForms } from "../utils/storage";

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
	const [state, setState] = React.useState(() =>
		getInitialState(props.formId, 0),
	);
	const { form, question } = state;
	const [questionId, setQuestionId] = React.useState(state.questionId);
	const [answers, setAnswers] = React.useState(() =>
		getInitialAnswerState(form),
	);

	React.useEffect(() => {
		setState(getInitialState(props.formId, questionId));
	}, [props.formId, questionId]);

	const handleAnswer = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const newAns = [...answers];
		newAns[questionId] = e.target.value;
		setAnswers(newAns);
	};

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value: string[] = [];
		const options = e.target.options;
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}
		const newAns = [...answers];
		newAns[questionId] = value.join(",");
		setAnswers(newAns);
	};

	return (
		<div className="flex flex-col">
			<h2 className="text-3xl my-3 font-semibold">Preview</h2>
			<div>
				<div>
					<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
						{question?.label}
					</label>
					{question?.kind === "text" ? (
						<input
							className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
							id={question?.id}
							type="text"
							name={question?.label}
							placeholder={question?.label}
							value={answers[questionId]}
							onChange={handleAnswer}
						/>
					) : question?.kind === "dropdown" ? (
						<select
							className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
							name={question?.label}
							placeholder={question?.label}
							value={answers[questionId]}
							onChange={handleAnswer}>
							<option value="">Select an option</option>
							{question?.options.map((option, index) => (
								<option key={index} value={option}>
									{option}
								</option>
							))}
						</select>
					) : question?.kind === "multiselect" ? (
						<>
							<span>Use ctrl+click to select multiple</span>
							<select
								className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
								multiple
								name={question?.label}
								placeholder={question?.label}
								value={answers[questionId]}
								onChange={handleChange}>
								{question?.options.map((option, index) => (
									<option key={index} value={option}>
										{option}
									</option>
								))}
							</select>
						</>
					) : (
						<div className="max-w-lg flex flex-wrap justify-start gap-x-4 gap-y-1">
							{question?.options.map((option, index) => (
								<div key={index} className="flex gap-2 items-center">
									<input
										className="w-4 h-4"
										type="radio"
										name={question?.label}
										checked={answers[questionId] === option}
										value={option}
										onChange={handleAnswer}
									/>
									<label>{option}</label>
								</div>
							))}
						</div>
					)}
				</div>
				{console.log(answers)}
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
