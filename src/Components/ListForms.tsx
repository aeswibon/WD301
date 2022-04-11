import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { formDataChecker } from "../types/form";
import { Link, useQueryParams } from "raviger";
import { Pagination, PaginationData } from "../types/pagination";
import { listForms } from "../utils/apiUtil";
import Loading from "./Loading";
import PaginationContainer from "./Pagination";
import AddForm from "./AddForm";
import Modal from "./Modal";

const fetchFormsData = async (
	setForms: React.Dispatch<
		React.SetStateAction<PaginationData<formDataChecker>>
	>,
	setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
	offset?: number,
	limit?: number,
) => {
	try {
		if (setLoading) {
			setLoading(true);
		}
		const offsetValue: number = offset ? offset : 0;
		const limitValue: number = limit ? limit : 5;
		const data: Pagination<formDataChecker> = await listForms({
			offset: offsetValue,
			limit: limitValue,
		});

		data.results.filter((form: formDataChecker) => form.is_public === true);
		setForms({
			count: data.count,
			prev: data.prev,
			next: data.next,
			results: data.results,
			limit: limitValue,
			activePage: offsetValue ? offsetValue / limitValue + 1 : 1,
		});
	} catch (error) {
		console.error(error);
	} finally {
		if (setLoading) {
			setLoading(false);
		}
	}
};

const ListForms = () => {
	const [loading, setLoading] = React.useState<boolean>(false);
	const [openForm, setOpenForm] = React.useState<boolean>(false);
	const [forms, setForms] = React.useState<PaginationData<formDataChecker>>({
		count: 0,
		prev: null,
		next: null,
		results: [],
		limit: 5,
		activePage: 0,
	});
	const [{ search }, setQueryParams] = useQueryParams();
	const [filterForms, setFilterForms] = React.useState<formDataChecker[]>([]);

	// get all the forms using api
	React.useEffect(() => {
		fetchFormsData(setForms, setLoading);
	}, []);

	// paginate the forms list
	const onPageChange = (page: number) => {
		const offset = (page - 1) * forms.limit;
		fetchFormsData(setForms, setLoading, offset, forms.limit);
	};

	// search the form
	React.useEffect(() => {
		const filterData = forms.results.filter((form) =>
			form.title.toLowerCase().includes(search?.trim().toLowerCase() || ""),
		);
		setFilterForms(() => filterData);
	}, [search, forms]);

	// delete the form
	const handleDelete = (id: Number | undefined) => {
		if (id) {
			const updatedForms = forms.results.filter(
				(form: formDataChecker) => form.id !== id,
			);
			forms.results.map((form: formDataChecker) => {
				if (form.id === id) {
					form.is_public = false;
				}
				return form;
			});
			setForms({
				...forms,
				results: updatedForms,
			});
		}
	};

	return (
		<>
			{loading && <Loading />}
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
			{search !== undefined && search !== "" && (
				<h2 className="text-xl font-bold mb-4">Search results for "{search}"</h2>
			)}

			{filterForms.length > 0 &&
				filterForms.map((form: formDataChecker) => (
					<div key={form.id} className="w-full">
						<div className="flex gap-4">
							<p className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800">
								{form.title}
							</p>
							<div className="flex space-x-2">
								<Link href={`/preview/${form.id}`} className="m-auto">
									<FontAwesomeIcon icon={faEye} />
								</Link>
								<Link href={`/forms/${form.id}`} className="m-auto">
									<FontAwesomeIcon icon={faEdit} />
								</Link>
								<button onClick={() => handleDelete(form.id)}>
									<FontAwesomeIcon icon={faTrashAlt} />
								</button>
							</div>
						</div>
					</div>
				))}

			<PaginationContainer
				count={forms.count}
				limit={forms.limit}
				activePage={forms.activePage}
				onPageChangeCB={onPageChange}
			/>
			<div className="flex justify-center">
				<button
					type="button"
					onClick={(_) => setOpenForm(true)}
					className="max-w-[300px] w-full text-center px-6 py-[6px] rounded-lg bg-blue-600 text-white font-semibold text-lg mt-4">
					Add a form
				</button>
				<Modal isOpen={openForm} closeCB={() => setOpenForm(false)}>
					<AddForm />
				</Modal>
			</div>
		</>
	);
};

export default ListForms;
