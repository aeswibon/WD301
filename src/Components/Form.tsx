import { Link } from "raviger";
import React from "react";
import { initialFormField } from "../types/form";
import { handleSave, initialState } from "../utils/storage";
import { NewFieldReducer } from "./reducers/FieldReducer";
import { formReducer } from "./reducers/formReducer";

const initialField: initialFormField = {
	label: "",
	kind: "",
	type: "text",
	options: "",
	fileToUpload: null,
};

const Form = (props: { formId: string }): JSX.Element => {
	const itemKey: string = "formData";
	const [fieldState, dispatchField] = React.useReducer(
		NewFieldReducer,
		initialField,
	);
	const [form, dispatch] = React.useReducer(formReducer, null, () =>
		initialState(itemKey, props.formId),
	);

	// focus on title of the form by default
	const titleRef = React.useRef<HTMLInputElement>(null);
	React.useEffect(() => {
		document.title = "Form Builder";
		titleRef.current?.focus();
		return () => {
			document.title = "React Form";
		};
	}, [form.title]);

	// remove form field
	const RemoveField = (id: string) => {
		dispatch({
			type: "remove_field",
			id,
		});
	};

	// add form field
	const AddField = () => {
		dispatch({
			type: "add_field",
			fieldData: fieldState,
			callback: () => {
				dispatchField({
					type: "clear_field",
				});
			},
		});
	};

	React.useEffect(() => {
		let timeout = setTimeout(() => {
			handleSave(itemKey, form);
		}, 100);
		return () => clearTimeout(timeout);
	}, [form]);

	return (
		<div>
			<form className="flex flex-col">
				<input
					type="text"
					value={form.title}
					onChange={(e) => dispatch({ type: "update_title", title: e.target.value })}
					className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800"
					ref={titleRef}
				/>
				{form.formFields.map((field) => (
					<div key={field.id} className="w-full">
						<span className="text-lg font-semibold px-2">{field.label}</span>
						<div className="flex gap-4">
							<input
								id={field.id}
								value={field.label}
								className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800"
								onChange={(e) =>
									dispatch({
										type: "update_label",
										id: field.id,
										value: e.target.value,
									})
								}
								placeholder={field.label}
							/>
							{(field.kind === "dropdown" ||
								field.kind === "radio" ||
								field.kind === "multiselect") && (
								<input
									id={field.id}
									value={field.options.join(",")}
									className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800"
									placeholder="Options comma(,) split"
									onChange={(e) =>
										dispatch({
											type: "update_options",
											id: field.id,
											options: e.target.value,
										})
									}
								/>
							)}
							<button
								type="button"
								onClick={() => RemoveField(field.id)}
								className="p-2 mt-2 bg-blue-600 rounded-lg text-white font-bold hover:text-blue-600 hover:bg-white hover:border-2 hover:border-blue-600">
								Remove
							</button>
						</div>
					</div>
				))}
				<div className="w-full">
					<div className="flex gap-4">
						<input
							value={fieldState.label}
							className="border-2 border-gray-200 bg-gray-200 rounded-lg p-4 my-2 w-full outline-none hover:outline-blue-800"
							type="text"
							onChange={(e) =>
								dispatchField({
									type: "update_label",
									value: e.target.value,
								})
							}
							placeholder="Add new Field"
						/>
						<select
							value={fieldState.kind}
							className="border-2 rounded-lg bg-gray-200 py-2 px-4 my-2"
							onChange={(e) =>
								dispatchField({ type: "update_field_kind", value: e.target.value })
							}>
							<option disabled value="">
								Select input kind
							</option>
							<option value="text">Text</option>
							<option value="dropdown">Dropdown</option>
							<option value="radio">Radio</option>
							<option value="multiselect">MultiSelect</option>
							<option value="file-upload">File Upload</option>
						</select>
						<button
							type="button"
							onClick={AddField}
							className="px-6 py-2 h-12 mt-4 bg-blue-600 rounded-lg text-white font-bold hover:text-blue-600 hover:bg-white hover:border-2 hover:border-blue-600">
							Add
						</button>
					</div>
				</div>
			</form>
			<div className="flex gap-4">
				<Link
					href="/"
					className="p-4 mt-4 text-center bg-blue-600 rounded-lg w-full text-white font-bold">
					Close Form
				</Link>
			</div>
		</div>
	);
};

export default Form;
