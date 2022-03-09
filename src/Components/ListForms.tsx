import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { formDataChecker } from "../interfaces/form";
import React from "react";
const ListForms = (props: {
	setState: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element => {
	const [forms, setForms] = React.useState<formDataChecker[]>([]);

	// get all the forms from localStorage
	React.useEffect(() => {
		const localForms = localStorage.getItem("formData");
		if (localForms) {
			setForms(JSON.parse(localForms));
		}
	}, []);

	// delete the form
	const handleDelete = (id: string) => {
		const updatedForms = forms.filter((form: formDataChecker) => form.id !== id);
		setForms(updatedForms);
		localStorage.setItem("formData", JSON.stringify(updatedForms));
	};

	// edit the form
	const handleEdit = (id: string) => {
		props.setState(id);
	};

	// add a form
	const handleAdd = () => {
		props.setState(new Date().getTime().toString());
	};

	return (
		<>
			{forms.length > 0 ? (
				<div>
					<span>Below are all the forms stored in local storage:</span>
				</div>
			) : (
				<div>Currently there are zero forms</div>
			)}
			{forms.length > 0 &&
				forms.map((form: formDataChecker) => (
					<div key={form.id} className="w-full">
						<div className="flex gap-4">
							<p
								id={form.id}
								className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800">
								{form.title}
							</p>
							<button onClick={() => handleEdit(form.id)}>
								<FontAwesomeIcon icon={faEdit} />
							</button>
							<button onClick={() => handleDelete(form.id)}>
								<FontAwesomeIcon icon={faTrashAlt} />
							</button>
						</div>
					</div>
				))}
			<button
				type="button"
				onClick={handleAdd}
				className="p-4 mt-4 bg-blue-600 rounded-lg w-full text-white font-bold">
				Add a form
			</button>
		</>
	);
};

export default ListForms;
