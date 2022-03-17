import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { formDataChecker } from "../interfaces/form";
import { Link, useQueryParams } from "raviger";

const ListForms = (): JSX.Element => {
	const [{ search }, setQueryParams] = useQueryParams();
	const [forms, setForms] = React.useState<formDataChecker[]>([]);
	const [filterForms, setFilterForms] = React.useState<formDataChecker[]>([]);

	// get all the forms from localStorage
	React.useEffect(() => {
		const localForms = localStorage.getItem("formData");
		if (localForms) {
			setForms(JSON.parse(localForms));
			setFilterForms(JSON.parse(localForms));
		}
	}, []);

	// search the form
	React.useEffect(() => {
		const filterData = forms.filter((form) =>
			form.title.toLowerCase().includes(search?.trim().toLowerCase() || ""),
		);
		setFilterForms(() => filterData);
	}, [search, forms]);

	// delete the form
	const handleDelete = (id: string) => {
		const updatedForms = forms.filter((form: formDataChecker) => form.id !== id);
		setForms(updatedForms);
		localStorage.setItem("formData", JSON.stringify(updatedForms));
	};

	return (
		<>
			<div className="flex flex-wrap -mx-3 mb-6">
				<div className="w-full px-3">
					<label
						className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
						htmlFor="grid-search">
						Search
					</label>
					<input
						className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
						id="grid-search"
						name="search"
						value={search}
						onChange={(e) => setQueryParams({ search: e.target.value })}
						type="search"
						placeholder="Search"
					/>
				</div>
			</div>
			{filterForms.length > 0 ? (
				<div>
					<span>Below are all the forms stored in local storage:</span>
				</div>
			) : (
				<div>Currently there are zero forms</div>
			)}
			{filterForms.length > 0 &&
				filterForms.map((form: formDataChecker) => (
					<div key={form.id} className="w-full">
						<div className="flex gap-4">
							<p
								id={form.id}
								className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800">
								{form.title}
							</p>
							<div className="flex space-x-2">
								<Link href={`/preview/${form.id}`} className="m-auto">
									<FontAwesomeIcon icon={faEye} />
								</Link>
								<Link href={`/form/${form.id}`} className="m-auto">
									<FontAwesomeIcon icon={faEdit} />
								</Link>
								<button onClick={() => handleDelete(form.id)}>
									<FontAwesomeIcon icon={faTrashAlt} />
								</button>
							</div>
						</div>
					</div>
				))}
			<div className="my-4">
				<Link
					href={`/form/${new Date().getTime().toString()}`}
					className="p-4 mt-10 bg-blue-600 rounded-lg w-full text-white font-bold">
					Add a form
				</Link>
			</div>
		</>
	);
};

export default ListForms;
