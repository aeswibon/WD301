import React from "react";
import MapPicker from "react-google-map-picker";
import { fieldChecker } from "../../types/form";

interface LocationProps {
	field: fieldChecker;
	error: string;
	answer: string;
	changeValueCB: (id: number, value: string) => void;
}

interface Location {
	lat: number;
	lng: number;
}

const DefaultLocation: Location = {
	lat: 26,
	lng: 80,
};

const LocationPicker = (props: LocationProps) => {
	const { field, error, answer, changeValueCB } = props;
	const [location, setLocation] = React.useState<Location>(DefaultLocation);
	const [zoom, setZoom] = React.useState<number>(10);
	const [show, setShow] = React.useState(false);

	React.useEffect(() => {
		if (answer) {
			const value = Array.from(answer.split(","), Number);
			setLocation({
				lat: value[0],
				lng: value[1],
			});
		}
	}, [answer]);
	React.useEffect(() => {
		let timer = setTimeout(() => setShow(true), 1000);
		return () => {
			clearTimeout(timer);
		};
	}, []);

	const handleChange = (lat: number, lng: number) => {
		setLocation({
			lat: lat,
			lng: lng,
		});
		const value = [lat, lng].join(",");
		changeValueCB(field.id!, value);
	};

	const handleChangeZoom = (newZoom: number) => {
		setZoom(newZoom);
	};
	return (
		<>
			<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
				{field.label}
			</label>
			<div className="flex gap-2">
				<div>
					<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
						Latitude:
					</label>
					<input
						type="text"
						value={location.lat}
						disabled
						className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
					/>
				</div>
				<div>
					<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
						Longitude:
					</label>
					<input
						type="text"
						value={location.lng}
						disabled
						className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
					/>
				</div>
			</div>
			<div className="flex mt-2">
				<div className="py-2 mb-4">
					<label className="uppercase tracking-wide text-gray-700 text-sm font-bold">
						Zoom:
					</label>
					<input type="text" className="ml-2" value={zoom} disabled />
				</div>
				<button
					className="bg-blue-500 text-white font-bold py-2 px-4 mb-4 rounded"
					onClick={(_) => {
						setLocation({ ...DefaultLocation });
						setZoom(10);
					}}>
					Reset Location
				</button>
			</div>
			{show && (
				<MapPicker
					defaultLocation={location}
					zoom={zoom}
					style={{ height: "300px" }}
					onChangeLocation={handleChange}
					onChangeZoom={handleChangeZoom}
					apiKey="AIzaSyAkBhTU6Tc8FNdu64ZRG4rPm2bin7H7OOI"
				/>
			)}
			{error && <span className="text-sm text-red-600">{error}</span>}
		</>
	);
};

export default LocationPicker;
