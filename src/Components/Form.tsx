import React from "react";
import { formDataChecker } from "../interfaces/form";

// const formFieldTemplate: formFieldChecker = {
// 	id: new Date().getTime().toString(),
// 	label: "",
// 	type: "text",
// 	value: "",
// };

// to get all the forms from localStorage
const getLocalForms = (): formDataChecker[] => {
	const localForms = localStorage.getItem("formData");
	return localForms ? JSON.parse(localForms) : [];
};

// save the form in localStorage
const saveLocalForms = (forms: formDataChecker[]) => {
	localStorage.setItem("formData", JSON.stringify(forms));
};

// to initiate the state of the form
const initialState = (id: string): formDataChecker => {
	const formData = getLocalForms();
	if (formData.length > 0) {
		for (let i = 0; i < formData.length; i++) {
			if (formData[i].id === id) {
				return formData[i];
			}
		}
	}
	const newForm = {
		id: id,
		title: "",
		formFields: [],
	};
	saveLocalForms([...formData, newForm]);
	return newForm;
};

// save the form on each input
const handleSave = (field: formDataChecker) => {
	const formData = getLocalForms();
	const updateFormData = formData.map((f) => {
		if (f.id === field.id) {
			return field;
		}
		return f;
	});
	saveLocalForms(updateFormData);
};

const Form = (props: {
	state: string;
	setState: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element => {
	const [form, setForm] = React.useState<formDataChecker>(
		initialState(props.state),
	);
	const [fieldInput, setFieldInput] = React.useState<string>("");

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
		setForm({
			...form,
			formFields: [
				...form.formFields,
				{
					id: new Date().getTime().toString(),
					label: fieldInput,
					value: "",
				},
			],
		});
		setFieldInput("");
	};

	React.useEffect(() => {
		let timeout = setTimeout(() => {
			handleSave(form);
		}, 1000);
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
								type={field.type}
								placeholder={field.label}
							/>
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
					{/* <span className="text-lg font-semibold px-2">{fieldInput.label}</span> */}
					<div className="flex gap-4">
						<input
							value={fieldInput}
							className="border-2 border-gray-200 bg-gray-200 rounded-lg p-4 my-2 w-full outline-none hover:outline-blue-800"
							type="text"
							onChange={handleAddField}
							placeholder="Add new Field"
						/>
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
				<button
					type="button"
					onClick={() => props.setState("listForms")}
					className="p-4 mt-4 bg-blue-600 rounded-lg w-full text-white font-bold">
					Submit
				</button>
			</div>
		</div>
	);
};

export default Form;
