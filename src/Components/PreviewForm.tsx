import { Link, navigate } from "raviger";
import React from "react";
import { Submission } from "../types/form";
import { Pagination } from "../types/pagination";
import { getSubmissions } from "../utils/apiUtil";
import Loading from "./Loading";

const getDate = (date: Date | undefined) => {
	if (date === undefined) return "";

	const newDate = new Date(date);
	return newDate.toDateString();
};

const PreviewForm = (props: { formId: number }) => {
	const [loading, setLoading] = React.useState(false);
	const [previewSubmissions, setPreviewSubmissions] = React.useState<
		Pagination<Submission>
	>({
		count: 0,
		next: null,
		prev: null,
		results: [],
	});

	React.useEffect(() => {
		document.title = "Form Preview";
		const fetchPreviewData = async () => {
			try {
				setLoading(true);
				const data: Pagination<Submission> = await getSubmissions(props.formId);
				setPreviewSubmissions(data);
			} catch (error) {
				console.log("Error fetching preview data", error);
			} finally {
				setLoading(false);
			}
		};
		fetchPreviewData();
	}, [props.formId]);

	return (
		<div className="flex flex-col">
			{loading && <Loading />}
			{previewSubmissions.count === 0 ? (
				<p className="text-xl text-red-600 font-medium text-center">
					No submissions yet
				</p>
			) : (
				<div className="">
					<h2 className="text-lg font-medium">
						Title:
						<span className="font-normal">
							{previewSubmissions.results[0].form?.title}
						</span>
					</h2>
					<h2 className="text-lg font-medium">
						Description:{" "}
						<span className="font-normal">
							{previewSubmissions.results[0].form?.description}
						</span>
					</h2>
					<h2 className="text-lg font-medium">
						Created On:{" "}
						<span className="font-normal">
							{getDate(previewSubmissions.results[0].form?.created_date)}
						</span>
					</h2>
					<h2 className="text-lg font-medium">
						Total Submissions:{" "}
						<span className="font-normal">{previewSubmissions.count}</span>
					</h2>
				</div>
			)}
			<div className="flex gap-4 justify-center mt-8">
				<Link
					href={`/preview/${props.formId}/submission`}
					className="bg-blue-500 px-4 py-3 rounded-lg text-white font-semibold">
					New Submission
				</Link>
				<button
					type="button"
					onClick={() => navigate("/")}
					className="bg-blue-500 px-4 py-3 rounded-lg text-white font-semibold">
					Back to forms
				</button>
			</div>
		</div>
	);
};

export default PreviewForm;
