import React from "react";
import { fieldChecker } from "../../types/form";

interface TextareaInputProps {
	field: fieldChecker;
	error: string;
	answer: string;
	changeValueCB: (id: number, value: string) => void;
}

const TextareaInput = (props: TextareaInputProps) => {
	const { field, answer, changeValueCB } = props;

	return (
		<div className="flex flex-col">
			<div>
				<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					{props.field.label}
				</label>
				<textarea
					className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
					autoFocus
					value={answer}
					title="Enter your answer"
					onChange={(e) => changeValueCB(field.id!, e.target.value)}
					placeholder={props.field.label}
				/>
			</div>
			{props.error && <span className="text-sm text-red-600">{props.error}</span>}
		</div>
	);
};

export default TextareaInput;
