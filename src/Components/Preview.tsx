import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, navigate } from "raviger";
import React from "react";
import { formDataChecker, BasicField } from "../types/form";
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
	const answers: BasicField[] = [];
	form.formFields.forEach((field, idx) => {
		answers[idx] = {
			id: field.id,
			label: field.label,
			value: "",
		};
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

	const handleAnswer = (value: string) => {
		setAnswers((answers) => {
			const updatedAnswers = answers.map((answer) => {
				if (answer.id === question?.id) {
					return {
						...answer,
						value: value,
					};
				}
				return answer;
			});
			return updatedAnswers;
		});
	};

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value: string[] = [];
		const options = e.target.options;
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}
		handleAnswer(value.join(","));
	};

	const resetAnswers = () => {
		setAnswers(() => getInitialAnswerState(form));
	};

	const handleSubmit = () => {
		let msg = "Hello User,\n";
		msg += "Your answers has been recorded.\n";
		msg += `Form title: ${form.title}\n\n`;
		answers.forEach((answer) => {
			msg += `${answer.label}: ${answer.value}\n`;
		});
		msg += "\nThank you for your time.";
		alert(msg);
	};

	return (
		<div className="flex flex-col">
			<div className="flex my-3 justify-between">
				<h2 className="text-3xl font-semibold">{form.title}</h2>
				<span>
					Question {questionId + 1}/{form.formFields.length}
				</span>
			</div>
			{question ? (
				<div className="flex flex-col">
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
								value={answers[questionId].value}
								onChange={(e) => handleAnswer(e.target.value)}
							/>
						) : question?.kind === "dropdown" ? (
							<select
								className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
								name={question?.label}
								placeholder={question?.label}
								value={answers[questionId].value}
								onChange={(e) => handleAnswer(e.target.value)}>
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
									value={answers[questionId].value}
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
											checked={answers[questionId].value === option}
											value={option}
											onChange={(e) => handleAnswer(e.target.value)}
										/>
										<label>{option}</label>
									</div>
								))}
							</div>
						)}
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
						{questionId === form.formFields.length - 1 && (
							<button
								onClick={handleSubmit}
								className="bg-rose-500 text-white font-bold py-2 px-4 my-4 rounded">
								Submit
							</button>
						)}
					</div>
				</div>
			) : (
				<span className="text-center text-lg font-bold">
					No question to preview
				</span>
			)}
			<div className="flex gap-4 justify-center mt-8">
				<Link
					href="/"
					className="bg-blue-500 px-4 py-3 rounded-lg text-white font-semibold">
					Close form
				</Link>
				<button
					onClick={resetAnswers}
					className="bg-blue-500 px-4 py-3 rounded-lg text-white font-semibold">
					Reset Answer
				</button>
			</div>
		</div>
	);
};

export default PreviewForm;
