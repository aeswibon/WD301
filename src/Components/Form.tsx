import React from "react";
import { formFieldChecker } from "../interfaces/form";

const Form = () => {
	const formFields: formFieldChecker[] = [
		{
			id: "id_sample",
			label: "Sample",
			type: "text",
			value: "This is a Sample field",
		},
	];
	const formFieldTemplate: formFieldChecker = {
		id: new Date().getTime().toString(),
		label: "",
		type: "text",
		value: "",
	};
	const [fields, setFields] = React.useState<formFieldChecker[]>(formFields);
	const [fieldInput, setFieldInput] =
		React.useState<formFieldChecker>(formFieldTemplate);
	const RemoveField = (field_id: string) => {
		setFields(fields.filter((f) => f.id !== field_id));
	};
	const AddField = () => {
		setFields([...fields, fieldInput]);
		setFieldInput(formFieldTemplate);
	};
	const ClearForm = () => {
		setFields(formFields);
		setFieldInput(formFieldTemplate);
	};
	const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFieldInput({
			...fieldInput,
			label: e.target.value,
			value: e.target.value,
		});
	};

	return (
		<div>
			<form className="flex flex-col">
				{fields.map((field) => {
					return (
						<div key={field.id} className="w-full">
							<span className="text-lg font-semibold px-2">{field.label}</span>
							<div className="flex gap-4">
								<input
									id={field.id}
									className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800"
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
					);
				})}
				<div className="w-full">
					<span className="text-lg font-semibold px-2">{fieldInput.label}</span>
					<div className="flex gap-4">
						<input
							value={fieldInput.value}
							className="border-2 border-gray-200 bg-gray-200 rounded-lg p-4 my-2 w-full outline-none hover:outline-blue-800"
							type={fieldInput.type}
							onChange={handleClick}
							placeholder={fieldInput.label}
						/>
						<button
							key={fieldInput.id}
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
					type="submit"
					className="p-2 h-12 mt-4 w-1/2 bg-blue-600 rounded-lg text-white font-bold hover:text-blue-600 hover:bg-white hover:border-2 hover:border-blue-600">
					Submit
				</button>
				<button
					type="button"
					onClick={ClearForm}
					className="p-2 h-12 mt-4 w-1/2 bg-blue-600 rounded-lg text-white font-bold hover:text-blue-600 hover:bg-white hover:border-2 hover:border-blue-600">
					Clear Form
				</button>
			</div>
		</div>
	);
};

export default Form;
