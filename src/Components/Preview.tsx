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

	const [open, setOpen] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string[]>(() => {
		if (question?.value === "") return [];
		return question?.value.split(",");
	});

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

	const handleFileInput = (file: FileList | null) => {
		if (file) {
			const name: string | undefined = file.item(0)?.name;
			setAnswers((answers) => {
				const updatedAnswers = answers.map((answer) => {
					if (answer.id === question?.id) {
						return {
							...answer,
							value: name ? name : "file",
							fileToUpload: file.item(0),
						};
					}
					return answer;
				});
				return updatedAnswers;
			});
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const item = e.target.value;
		if (e.target.checked) {
			setSelected((p) => {
				return [...p, item];
			});
		} else {
			setSelected((p) => {
				return [...p.filter((i) => i !== item)];
			});
		}
	};

	const resetAnswers = () => {
		setOpen(false);
		setSelected([]);
		setAnswers(() => getInitialAnswerState(form));
	};

	React.useEffect(() => {
		handleAnswer(selected.join(","));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected]);

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
								<option disabled value="">
									Select an option
								</option>
								{question?.options.map((option, index) => (
									<option key={index} value={option}>
										{option}
									</option>
								))}
							</select>
						) : question?.kind === "multiselect" ? (
							<>
								<div
									onClick={() => {
										setOpen((p) => !p);
									}}
									className="appearance-none w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none flex justify-between items-center hover:cursor-pointer">
									{selected.length > 0 ? (
										<div>{selected.join(",")}</div>
									) : (
										<div>Select</div>
									)}
									<span className="before:content-['▼']"></span>
								</div>
								{open && (
									<div>
										<div className="flex gap-2 items-center hover:text-white hover:bg-blue-500 hover:cursor-pointer">
											<input
												type="checkbox"
												name={"Select all"}
												className="p-2"
												onChange={(e) => {
													if (e.target.checked) {
														setSelected(question?.options);
													} else setSelected([]);
												}}
											/>
											<label>Select all</label>
										</div>
										{question?.options.map((option, index) => {
											return (
												<div
													key={index}
													className="flex gap-2 items-center hover:text-white hover:bg-blue-500 hover:cursor-pointer">
													<input
														type="checkbox"
														id={question?.id}
														name={option}
														value={option}
														onChange={handleChange}
														checked={selected.includes(option)}
														className="p-2"
													/>
													<label>{option}</label>
												</div>
											);
										})}
									</div>
								)}
							</>
						) : question?.kind === "radio" ? (
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
						) : (
							<input
								type="file"
								accept=".jpg"
								onChange={(e) => handleFileInput(e.target.files)}
							/>
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
