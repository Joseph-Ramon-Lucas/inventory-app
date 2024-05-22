import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../App.css";
import { Button } from "@/components/ui/button";

export function Home() {
	const doATing = () => {
		console.log("ting done");
	};

	return (
		<>
			<div>
				<h1>Cabinet</h1>
				<h2>Personal Inventory App</h2>

				<Button onClick={doATing}>aaa</Button>
			</div>
		</>
	);
}
