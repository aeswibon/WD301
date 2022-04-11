import { Link, navigate } from "raviger";
import React from "react";
import { formReducer, FormReducerState } from "../reducers/formReducer";
import { fieldChecker, formDataChecker, User } from "../types/form";
import { Error, Pagination } from "../types/pagination";
import {
	addField,
	getFormData,
	getFormFields,
	me,
	removeField,
	updateField,
	updateFormTitle,
} from "../utils/apiUtil";
import { validateFormField } from "../utils/formFields";
import Loading from "./Loading";

const initialData: FormReducerState = {
	loading: false,
	formFields: [],
};

const updateTitle = async (formId: number, title: string) => {
	try {
		await updateFormTitle(formId, title);
	} catch (error) {
		console.log(error);
	}
};

interface labelChecker {
	field: fieldChecker;
	formId: number;
	removeFieldCB: (id: number) => void;
}

const Label = (props: labelChecker) => {
	const { field, formId, removeFieldCB } = props;
	const [fieldData, setFieldData] = React.useState<fieldChecker>(field);

	React.useEffect(() => {
		let timeout = setTimeout(async () => {
			await updateField(formId, fieldData.id!, fieldData);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [fieldData, formId]);

	return (
		<div className="flex flex-col">
			<label className="text-lg font-semibold px-2">{fieldData.label}</label>
			<div className="flex gap-4">
				<input
					type="text"
					value={fieldData.label}
					className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800"
					onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
					placeholder="Label"
				/>
				{(fieldData.kind === "RADIO" ||
					fieldData.kind === "DROPDOWN" ||
					fieldData.meta === "multiselect") && (
					<input
						type="text"
						value={fieldData.options}
						placeholder="Options separated by ,(comma)"
						onChange={(e) => setFieldData({ ...fieldData, options: e.target.value })}
						className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800"
					/>
				)}
				<button
					type="button"
					onClick={() => removeFieldCB(fieldData.id!)}
					className="p-2 mt-2 bg-blue-600 rounded-lg text-white font-bold hover:text-blue-600 hover:bg-white hover:border-2 hover:border-blue-600">
					Remove
				</button>
			</div>
		</div>
	);
};

interface addFieldChecker {
	formId: number;
	setLoadingCB: (value: boolean) => void;
	setFormFieldsCB: (data: fieldChecker) => void;
}

const AddFields = (props: addFieldChecker) => {
	const [errors, setErrors] = React.useState<Error<fieldChecker>>({});
	const [newField, setNewField] = React.useState<fieldChecker>({
		label: "",
		kind: "TEXT",
		options: "",
	});

	const handleChange = (kind: string) => {
		if (kind === "RADIO" || kind === "DROPDOWN" || kind === "TEXT") {
			setNewField({
				...newField,
				kind: kind,
				meta: "",
			});
		} else {
			setNewField({
				...newField,
				meta: kind,
				kind: "NULL",
			});
		}
		console.log(newField);
	};

	// Add a new field
	const handleAddField = async () => {
		const validationError = validateFormField(newField);
		setErrors(validationError);

		if (Object.keys(validationError).length === 0) {
			try {
				props.setLoadingCB(true);
				const newFieldData = newField;
				if (newField.kind === "NULL") {
					newFieldData.kind = "TEXT";
				}
				console.log(newFieldData);
				const data: fieldChecker = await addField(props.formId, newFieldData);
				props.setFormFieldsCB(data);
				setNewField({
					label: "",
					kind: "TEXT",
					options: "",
				});
			} catch (error) {
				console.log(error);
			} finally {
				props.setLoadingCB(false);
			}
		}
	};

	return (
		<div className="w-full">
			<div className="flex gap-4">
				<input
					value={newField.label}
					className="border-2 border-gray-200 bg-gray-200 rounded-lg p-4 my-2 w-full outline-none hover:outline-blue-800"
					type="text"
					onChange={(e) => setNewField({ ...newField, label: e.target.value })}
					placeholder="Add new Field"
				/>
				{errors.label && <span className="text-red-500">{errors.label}</span>}
				<select
					value={newField.meta ? newField.meta : newField.kind}
					className="border-2 rounded-lg bg-gray-200 py-2 px-4 my-2"
					onChange={(e) => handleChange(e.target.value)}>
					<option disabled value="">
						Select input kind
					</option>
					<option value="TEXT">Text</option>
					<option value="DROPDOWN">Dropdown</option>
					<option value="RADIO">Radio</option>
					<option value="multiselect">MultiSelect</option>
					<option value="file-upload">File Upload</option>
				</select>
				{errors.kind && <span className="text-red-500">{errors.kind}</span>}
				<button
					type="button"
					onClick={handleAddField}
					className="px-6 py-2 h-12 mt-4 bg-blue-600 rounded-lg text-white font-bold hover:text-blue-600 hover:bg-white hover:border-2 hover:border-blue-600">
					Add
				</button>
			</div>
		</div>
	);
};

const Form = (props: { formId: number }) => {
	const [form, setForm] = React.useState<formDataChecker>({
		title: "",
	});
	const [data, dispatch] = React.useReducer(formReducer, initialData);
	const titleRef = React.useRef<HTMLInputElement>(null);

	// check whether user is logged in or not
	React.useEffect(() => {
		const authenticateUser = async () => {
			const user: User = await me();
			if (user.username.length < 1) {
				alert("You must be logged in to create a form");
				navigate("/login");
			}
		};
		authenticateUser();
	}, []);

	React.useEffect(() => {
		const fetchFormData = async () => {
			try {
				dispatch({
					type: "update_loading",
					payload: true,
				});

				const formData: formDataChecker = await getFormData(props.formId);
				setForm(formData);

				const formFieldsData: Pagination<fieldChecker> = await getFormFields(
					props.formId,
				);
				dispatch({
					type: "set_form_fields",
					payload: formFieldsData.results,
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
		fetchFormData();
	}, [props.formId]);

	// update form title
	React.useEffect(() => {
		document.title = `Form - ${form.title}`;
		titleRef.current?.focus();

		const handleFormTitleChange = async () => {
			if (!form.id) return;
			if (form.title.length < 1 || form.title.length > 100) {
				alert("Title must be between 1 and 100 characters");
				return;
			}
			updateTitle(props.formId, form.title);
		};
		let timeout = setTimeout(() => {
			handleFormTitleChange();
		}, 1000);

		return () => {
			clearTimeout(timeout);
		};
	}, [form.id, form.title, props.formId]);

	// Remove a field from the active form...
	const handleRemoveField = async (fieldId: number) => {
		try {
			await removeField(props.formId, fieldId);
			dispatch({
				type: "remove_field",
				fieldId: fieldId,
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			{data.loading && <Loading />}
			<form className="flex flex-col">
				<input
					type="text"
					value={form.title}
					placeholder="Form Title"
					onChange={(e) => setForm({ ...form, title: e.target.value })}
					className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800"
					ref={titleRef}
				/>
				{data.formFields.map((field) => (
					<Label
						key={field.id}
						field={field}
						formId={props.formId}
						removeFieldCB={handleRemoveField}
					/>
				))}
				<AddFields
					formId={props.formId}
					setLoadingCB={(value: boolean) =>
						dispatch({
							type: "update_loading",
							payload: value,
						})
					}
					setFormFieldsCB={(data: fieldChecker) =>
						dispatch({
							type: "add_form_field",
							payload: data,
						})
					}
				/>
			</form>
			<div className="flex gap-4">
				<Link
					href="/"
					className="p-4 mt-4 text-center bg-blue-600 rounded-lg w-full text-white font-bold">
					Close
				</Link>
			</div>
		</div>
	);
};

export default Form;
