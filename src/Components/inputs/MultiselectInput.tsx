import React from "react";
import { fieldChecker } from "../../types/form";

interface MultiselectInputProps {
	field: fieldChecker;
	error: string;
	answer: string;
	changeValueCB: (id: number, value: string) => void;
}

export default function MultiselectInput(props: MultiselectInputProps) {
	const { field, error, answer, changeValueCB } = props;
	const [open, setOpen] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string[]>(
		answer.split(",") || [],
	);
	const options = field.options!.split(",");

	React.useEffect(() => {
		let timeout = setTimeout(() => {
			changeValueCB(field.id!, selected.join(","));
		}, 1000);

		return () => clearTimeout(timeout);
	}, [changeValueCB, field.id, options, selected]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const item = e.target.value;
		if (e.target.checked) {
			setSelected((p) => {
				return [...p, item];
			});
		} else {
			setSelected((p) => {
				return [...p.filter((i) => i !== item)];
			});
		}
	};

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
				<div className="px-2">
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
					{options.map((option, index) => {
						return (
							<div
								key={index}
								className="flex gap-2 items-center hover:text-white hover:bg-blue-500 hover:cursor-pointer">
								<input
									type="checkbox"
									id={`${index}`}
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
			{error && <span className="text-sm text-red-600">{error}</span>}
		</div>
	);
}
