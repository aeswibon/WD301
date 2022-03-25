import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "raviger";
import React from "react";
import { formDataChecker, previewForm } from "../types/form";
import { handleSave, initialPreviewState } from "../utils/storage";
import { previewReducer } from "./reducers/PreviewReducer";

const initialPreview = (
	from: string,
	to: string,
	formId: string,
): previewForm => {
	const formAnswers = initialPreviewState(from, to, formId);
	return {
		formAnswers,
		activeIndex: 0,
	};
};

const PreviewForm = (props: { formId: string }): JSX.Element => {
	const itemKey: string = "answerData";
	const [previewState, dispatch] = React.useReducer(previewReducer, null, () =>
		initialPreview("formData", itemKey, props.formId),
	);
	const form: formDataChecker = previewState.formAnswers;
	React.useEffect(() => {
		let timeout = setTimeout(() => {
			handleSave(itemKey, form);
		}, 100);
		return () => {
			clearTimeout(timeout);
		};
	}, [form]);

	const handleSubmit = () => {
		let msg = "Hello User,\n";
		msg += "Your answers has been recorded.\n";
		msg += `Form title: ${form.title}\n\n`;
		form.formFields.forEach((field) => {
			msg += `${field.label}: ${field.value}\n`;
		});
		msg += "\nThank you for your time.";
		alert(msg);
	};

	// get the next active index
	const nextField = () => {
		let currentIndex = previewState.activeIndex;
		const len = form.formFields.length;
		currentIndex = currentIndex >= len - 2 ? len - 1 : currentIndex + 1;
		dispatch({
			type: "update_active_index",
			curr_idx: currentIndex,
		});
	};

	// get the previous active index
	const previousField = () => {
		let currentIndex = previewState.activeIndex;
		currentIndex = currentIndex <= 1 ? 0 : currentIndex - 1;
		dispatch({
			type: "update_active_index",
			curr_idx: currentIndex,
		});
	};

	// dispatch the answer forms
	const handleAnswer = (id: string, value: string) => {
		dispatch({
			type: "update_answer",
			id,
			value,
		});
	};

	const handleChange = (id: string, data: HTMLOptionsCollection) => {
		const value: string[] = [];
		const options = data;
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}
		console.log(id);
		handleAnswer(id, value.join(","));
	};

	const handleInput = (id: string, file: FileList | null) => {
		if (file) {
			const name: string | undefined = file.item(0)?.name;
			dispatch({
				type: "update_answer",
				id,
				value: name ? name : "file",
				fileToUpload: file.item(0),
			});
		}
	};

	return (
		<div className="flex flex-col">
			<div className="flex my-3 justify-between">
				<h2 className="text-3xl font-semibold">{form.title}</h2>
				<span>
					Question {previewState.activeIndex + 1}/{form.formFields.length}
				</span>
			</div>
			{form.formFields.length > 0 ? (
				form.formFields.map((question, index) => {
					return (
						<React.Fragment key={index}>
							{previewState.activeIndex === index && (
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
												value={question?.value}
												onChange={(e) => handleAnswer(question?.id, e.target.value)}
											/>
										) : question?.kind === "dropdown" ? (
											<select
												className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
												name={question?.label}
												placeholder={question?.label}
												value={question?.value}
												onChange={(e) => handleAnswer(question?.id, e.target.value)}>
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
													className="form-control appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
													multiple
													name={question?.label}
													placeholder={question?.label}
													// value={question?.value}
													onChange={(e) => handleChange(question?.id, e.target.options)}>
													{question?.options.map((option, index) => (
														<option key={index} value={option}>
															{option}
														</option>
													))}
												</select>
											</>
										) : question?.kind === "radio" ? (
											<div className="max-w-lg flex flex-wrap justify-start gap-x-4 gap-y-1">
												{question?.options.map((option, index) => (
													<div key={index} className="flex gap-2 items-center">
														<input
															className="w-4 h-4"
															type="radio"
															name={question?.label}
															checked={question?.value === option}
															value={option}
															onChange={(e) => handleAnswer(question?.id, e.target.value)}
														/>
														<label>{option}</label>
													</div>
												))}
											</div>
										) : (
											<input
												type="file"
												accept=".jpg"
												onChange={(e) => handleInput(question?.id, e.target.files)}
											/>
										)}
									</div>
									<div className="flex justify-end w-full gap-2">
										{previewState.activeIndex > 0 && (
											<button
												type="button"
												className="bg-blue-500 text-white font-bold py-2 px-4 my-4 rounded"
												onClick={previousField}>
												<FontAwesomeIcon icon={faArrowLeft} /> Previous
											</button>
										)}
										{previewState.activeIndex < form.formFields.length - 1 && (
											<button
												type="button"
												className="bg-rose-500 text-white font-bold py-2 px-4 my-4 rounded"
												onClick={nextField}>
												Next <FontAwesomeIcon icon={faArrowRight} />
											</button>
										)}
										{previewState.activeIndex === form.formFields.length - 1 && (
											<button
												onClick={handleSubmit}
												className="bg-rose-500 text-white font-bold py-2 px-4 my-4 rounded">
												Submit
											</button>
										)}
									</div>
								</div>
							)}
						</React.Fragment>
					);
				})
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
					type="button"
					onClick={() => {
						dispatch({
							type: "reset_answer",
						});
					}}
					className="bg-blue-500 px-4 py-3 rounded-lg text-white font-semibold">
					Reset Answer
				</button>
			</div>
		</div>
	);
};

export default PreviewForm;
