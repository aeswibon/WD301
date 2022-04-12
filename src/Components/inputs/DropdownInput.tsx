import React from "react";
import { fieldChecker } from "../../types/form";

interface DropdownInputProps {
	field: fieldChecker;
	error: string;
	answer: string;
	changeValueCB: (id: number, value: string) => void;
}

const DropdownInput = (props: DropdownInputProps) => {
	const { field, answer, changeValueCB } = props;
	const [options] = React.useState(field.options!.split(","));

	return (
		<div className="flex flex-col">
			<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
				{field.label}
			</label>
			<select
				value={answer}
				onChange={(e) => {
					e.preventDefault();
					changeValueCB(field.id!, e.target.value);
				}}
				title="Select an option"
				className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none">
				<option value="" disabled>
					Select an option
				</option>
				{options.map((option, index) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
			{props.error && <span className="text-sm text-red-600">{props.error}</span>}
		</div>
	);
};

export default DropdownInput;
