import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

if (process.env.REACT_APP_SENTRY_DSN) {
	Sentry.init({
		dsn: process.env.REACT_APP_SENTRY_DSN,
		integrations: [new BrowserTracing()],
		tracesSampleRate: 1.0,
	});
}

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root"),
);

serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
