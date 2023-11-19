import React, { Key, useContext, useEffect, useState } from "react";
import { fetchObservations } from "./fetches";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import de from "date-fns/locale/de";
import { RenderChart } from "./RenderChart";
import { exportObservations } from "./exportObservations";
import { SensorContext } from "../App";

// Register german locale for datepicker
registerLocale("de", de);
setDefaultLocale("de");

function DatastreamContent() {
	const {
		selectedDatastream
	} = useContext(SensorContext)!;
	const { name, description, unitOfMeasurement, ObservedProperty } = selectedDatastream;

	const [observations, setObservations] = useState(selectedDatastream.Observations);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [resultAmount, setResultAmount] = useState(20);
	const [nextLink, setNextLink] = useState<undefined | null>();
	const [isFetchObservations, setIsFetchObserevations] = useState(false);
	const [downloadType, setDownloadType] = useState("csv");


	useEffect(() => {
		const handleFetch = async () => {
			try {
				const response = await fetchObservations(
					selectedDatastream["@iot.id"],
					resultAmount,
					startDate,
					endDate,
					nextLink
				);
				console.log(response);
				if (response) {
					setObservations(response);
				}
			} catch (error) {
				console.log(error);
			}
		};
		if (isFetchObservations) {
			handleFetch();
			setIsFetchObserevations(false)
		}

	}, [startDate, endDate, nextLink, resultAmount, isFetchObservations, selectedDatastream]);



	return (
		<>
			<div style={{ display: "flex", width: "100%" }}>
				<div style={{ width: "50%", marginRight: "10px" }}>
					<h3>Datastream:</h3>
					<p>Name: {name} id: {selectedDatastream["@iot.id"]}</p>
					<p>Description: {description}</p>
					<p>
						Unit of Measurement: {unitOfMeasurement.name} (
						{unitOfMeasurement.symbol})
					</p>
					<p>Observed Property: {ObservedProperty.name}</p>
					<p>
						Definition:{" "}
						<a href={ObservedProperty.definition}>{ObservedProperty.definition}</a>
					</p>
					<p>Description: {ObservedProperty.description}</p>
				</div>
				<div style={{ width: "50%" }}>
					<h3>Observations:</h3>
					<div style={{ display: "flex" }}>
						<div>
							<p>Start time: Doesn't apply if empty</p>
							<DatePicker
								selected={endDate}
								onChange={(date: Date | null) => setEndDate(date)}
								dateFormat="yyyy-MM-dd HH:mm:ss"
								timeInputLabel="Time:"
								showTimeInput
								placeholderText="End Date"
							/>
						</div>
						<div>
							<p>End time</p>
							<DatePicker
								selected={startDate}
								onChange={(date: Date | null) => setStartDate(date!)}
								dateFormat="yyyy-MM-dd HH:mm:ss"
								timeInputLabel="Time:"
								showTimeInput
							/>
						</div>
					</div>
					<button onClick={() => setStartDate(new Date())}>
						Set end to current time
					</button>
					<br />
					<button onClick={() => {
						setNextLink(null)
						setIsFetchObserevations(true);
					}}>
						Fetch observations
					</button>
					<br />
					<p>Amount of results per page:</p>
					<input
						type="number"
						placeholder="20"
						value={resultAmount}
						onChange={(e) => setResultAmount(parseInt(e.target.value))}
					/>
					<br />
					<br />
					<button onClick={() => {
						setNextLink(observations["@iot.nextLink"])
						setIsFetchObserevations(true);
					}}>
						Show next page
					</button>
					<div style={{ display: "flex" }}>
						<button onClick={() => exportObservations(observations, downloadType)}>
							Save observations as
						</button>
						<select
							value={downloadType}
							onChange={(e) => setDownloadType(e.target.value)
							}>
							<option value="csv">CSV</option>
							<option value="json">JSON</option>
						</select>
					</div>
				</div>
			</div>
			<div><RenderObservations observations={observations} /></div>
		</>
	);


}


// Render observations stuff
function RenderObservations(observations: any) {

	return (
		<>
			<div style={{ overflowX: "scroll", whiteSpace: "nowrap" }}>
				<ObservationList />
			</div>
			<RenderChart />
		</>
	);

	function ObservationList(): any {
		const {
			selectedDatastream
		} = useContext(SensorContext)!;
		if (observations === undefined) {
			return null;
		}
		try {
			return selectedDatastream.Observations.map(
				(
					observation: any,
					index: Key | null | undefined
				) => (
					<div
						key={index}
						style={{
							display: "inline-block",
							margin: "10px",
							padding: "10px",
							border: "1px solid gray",
							backgroundColor:
								observation.resultTime === null || observation.result === null
									? "darkred"
									: "none",
						}}
					>
						<p>
							{observation.resultTime !== null
								? observation.resultTime.split("T")[0]
								: "Result Time: null"}
						</p>
						<p>
							{observation.resultTime !== null
								? observation.resultTime.split("T")[1].split(".")[0]
								: "Time: null"}
						</p>
						<p>Result: {observation.result}</p>
					</div>
				)
			);
		} catch (error) {
			console.log(error);
			console.log(observations);
		}
	}
}

export { DatastreamContent };
