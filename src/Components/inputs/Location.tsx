import React from "react";
import MapPicker from "react-google-map-picker";

const DefaultLocation = { lat: 10, lng: 106 };
const DefaultZoom = 10;

const LocationPicker = () => {
	const [defaultLocation, setDefaultLocation] = React.useState(DefaultLocation);
	const [location, setLocation] = React.useState(defaultLocation);
	const [zoom, setZoom] = React.useState(DefaultZoom);

	const handleChange = (lat: number, lng: number) => {
		setLocation({ lat: lat, lng: lng });
	};

	const handleChangeZoom = (newZoom: number) => {
		setZoom(newZoom);
	};
	return (
		<>
			<button
				onClick={(_) => {
					setDefaultLocation({ ...DefaultLocation });
					setZoom(DefaultZoom);
				}}>
				Reset Location
			</button>
			<label>Latitude:</label>
			<input type="text" value={location.lat} disabled />
			<label>Longitude:</label>
			<input type="text" value={location.lng} disabled />
			<label>Zoom:</label>
			<input type="text" value={zoom} disabled />
			<MapPicker
				defaultLocation={defaultLocation}
				zoom={zoom}
				style={{ height: "700px" }}
				onChangeLocation={handleChange}
				onChangeZoom={handleChangeZoom}
				apiKey="AIzaSyAkBhTU6Tc8FNdu64ZRG4rPm2bin7H7OOI"
			/>
		</>
	);
};

export default LocationPicker;
