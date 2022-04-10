import React from "react";
import { fieldChecker } from "../../types/form";

interface MultiselectInputProps {
	field: fieldChecker;
	options: string[];
	error: string;
	changeValueCB: (id: number, value: string) => void;
}

export default function MultiselectInput(props: MultiselectInputProps) {
	const { field, options, changeValueCB } = props;
	const [open, setOpen] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string[]>([]);

	// React.useEffect(() => {
	// 	let timeout = setTimeout(() => {
	// 		changeValueCB(field.id!, options.join(","));
	// 	}, 1000);

	// 	return () => clearTimeout(timeout);
	// }, [multiAnswers]);

	// const handleChange = (
	// 	e: React.ChangeEvent<HTMLInputElement>,
	// 	value: string,
	// ) => {
	// 	if (e.target.checked) {
	// 		setMultiAnswers([...multiAnswers, value]);
	// 	} else {
	// 		setMultiAnswers(multiAnswers.filter((answer) => answer !== value));
	// 	}
	// };

	return (
		<div className="flex flex-col">
			<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
				{field.label}
			</label>
			<div
				onClick={() => {
					setOpen((p) => !p);
				}}
				className="appearance-none w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none flex justify-between items-center hover:cursor-pointer">
				{selected.length > 0 ? <div>{selected.join(",")}</div> : <div>Select</div>}
				<span className="before:content-['▼']"></span>
			</div>
			{open && (
				<div>
					<div className="flex gap-2 items-center hover:text-white hover:bg-blue-500 hover:cursor-pointer">
						<input
							type="checkbox"
							name={"Select all"}
							className="p-2"
							onChange={(e) => {
								if (e.target.checked) {
									setSelected(options);
								} else setSelected([]);
							}}
						/>
						<label>Select all</label>
					</div>
					{question?.options.map((option, index) => {
						return (
							<div
								key={index}
								className="flex gap-2 items-center hover:text-white hover:bg-blue-500 hover:cursor-pointer">
								<input
									type="checkbox"
									id={question?.id}
									name={option}
									value={option}
									onChange={handleChange}
									checked={selected.includes(option)}
									className="p-2"
								/>
								<label>{option}</label>
							</div>
						);
					})}
				</div>
			)}
			<div className="bg-white rounded-lg px-4 py-2 mt-2">
				{openOptions && (
					<div className="h-24 overflow-y-scroll">
						{field.options!.split(",").map((option, index) => (
							<div className="flex gap-2 items-center" key={index}>
								<input
									type="checkbox"
									id={`${index}`}
									checked={
										multiAnswers.find((answer) => answer === option) ? true : false
									}
									onChange={(e) => handleChange(e, option)}
								/>
								<label htmlFor={`${index}`}>{option}</label>
							</div>
						))}
					</div>
				)}
			</div>
			<div className="flex flex-row flex-wrap gap-x-2 items-center mt-4">
				{multiAnswers.map(
					(answer, index) =>
						answer.length > 0 && (
							<span key={index} className="bg-white rounded-lg px-3 py-1 text-sm">
								{answer}
							</span>
						),
				)}
			</div>
			{props.error && <span className="text-sm text-red-600">{props.error}</span>}
		</div>
	);
}
