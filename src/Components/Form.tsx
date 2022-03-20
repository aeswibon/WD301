import { Link } from "raviger";
import React from "react";
import { formDataChecker } from "../types/form";
import { handleSave, initialState } from "../utils/storage";
import { generateFormField } from "../utils/formFields";

const Form = (props: { formId: string }): JSX.Element => {
	const [form, setForm] = React.useState<formDataChecker>(() =>
		initialState(props.formId),
	);
	const [fieldInput, setFieldInput] = React.useState<string>("");
	const [fieldType, setFieldType] = React.useState<string>("");

	// focus on title of the form by default
	const titleRef = React.useRef<HTMLInputElement>(null);
	React.useEffect(() => {
		document.title = "Form Builder";
		titleRef.current?.focus();
		return () => {
			document.title = "React Form";
		};
	}, []);

	// remove form field
	const RemoveField = (field_id: string) => {
		setForm({
			...form,
			formFields: form.formFields.filter((f) => f.id !== field_id),
		});
	};

	// add form field
	const AddField = () => {
		const newFormField = generateFormField(fieldType, fieldInput);
		setForm({
			...form,
			formFields: [...form.formFields, newFormField],
		});
		setFieldInput("");
	};

	React.useEffect(() => {
		let timeout = setTimeout(() => {
			handleSave(form);
		}, 100);
		return () => clearTimeout(timeout);
	}, [form]);

	const handleAddField = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFieldInput(e.target.value);
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((form) => {
			const updatedFormFields = form.formFields.map((field) => {
				if (field.id === e.target.id) {
					return {
						...field,
						label: e.target.value,
						value: e.target.value,
					};
				}
				return field;
			});
			return {
				...form,
				formFields: updatedFormFields,
			};
		});
	};

	const AddOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
		const options = e.target.value.split(",");
		setForm((form) => {
			const updatedFormFields = form.formFields.map((field) => {
				if (field.id === e.target.id) {
					return {
						...field,
						options: options,
					};
				}
				return field;
			});
			return {
				...form,
				formFields: updatedFormFields,
			};
		});
	};

	const ClearForm = () => {
		setForm((form) => {
			const updatedFormFields = form.formFields.map((field) => {
				return {
					...field,
					value: "",
				};
			});
			return {
				...form,
				formFields: updatedFormFields,
			};
		});
		setFieldInput("");
	};

	return (
		<div>
			<form className="flex flex-col">
				<input
					type="text"
					value={form.title}
					onChange={(e) => setForm({ ...form, title: e.target.value })}
					className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800"
					ref={titleRef}
				/>
				{form.formFields.map((field) => (
					<div key={field.id} className="w-full">
						<span className="text-lg font-semibold px-2">{field.label}</span>
						<div className="flex gap-4">
							<input
								id={field.id}
								value={field.value}
								className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800"
								onChange={handleInput}
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
									onChange={AddOptions}
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
							value={fieldInput}
							className="border-2 border-gray-200 bg-gray-200 rounded-lg p-4 my-2 w-full outline-none hover:outline-blue-800"
							type="text"
							onChange={handleAddField}
							placeholder="Add new Field"
						/>
						<select
							className="border-2 rounded-lg bg-gray-200 py-2 px-4 my-2"
							onChange={(e) => setFieldType(e.target.value)}>
							<option value="text">Text</option>
							<option value="dropdown">Dropdown</option>
							<option value="radio">Radio</option>
							<option value="multiselect">MultiSelect</option>
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
				<button
					type="button"
					onClick={ClearForm}
					className="p-4 mt-4 bg-blue-600 rounded-lg w-full text-white font-bold">
					Clear form
				</button>
			</div>
		</div>
	);
};

export default Form;
