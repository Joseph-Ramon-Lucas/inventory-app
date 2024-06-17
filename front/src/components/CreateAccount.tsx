import { useEffect, useState } from "react";
// import "../App.css";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link } from "react-router-dom";
import axios from "axios";

export function CreateAccount() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [retypePassword, setRetypePassword] = useState("");
	const [errorText, setErrorText] = useState("");
	const [matching, setMatching] = useState(false);

	useEffect(() => {
		console.log(password, retypePassword);
		if (password !== retypePassword) {
			setErrorText("Passwords do not match!!");
			setMatching(false);
		} else {
			setErrorText("");
			setMatching(true);
		}
	}, [password, retypePassword]);

	function handleSubmit(username: string, password: string) {}

	return (
		<div>
			<Link to="/">
				<Button>Home 🏠</Button>
			</Link>
			<h1>Create your Cabinet Account</h1>
			<div id="textFields">
				<div className="labels">
					<Label htmlFor="username">Username</Label>
					<Label htmlFor="password">Password</Label>
					<Label htmlFor="retypePassword">Retype Password</Label>
				</div>
				<div className="inputs">
					<div>
						<Input
							type="username"
							id="username"
							placeholder="username"
							onChange={(event) => {
								setUsername(event.target.value);
							}}
						/>
					</div>

					<br />
					<div>
						<Input
							type="password"
							id="password"
							placeholder="password"
							onChange={(event) => {
								setPassword(event.target.value);
							}}
						/>
					</div>

					<br />
					<div>
						<Input
							type="password"
							id="retypePassword"
							placeholder="Retype your password"
							onChange={(event) => {
								setRetypePassword(event.target.value);
							}}
						/>
					</div>
				</div>
			</div>
			<div id="errorDiv">{errorText ?? (errorText && true)}</div>
			<div id="submit">
				<Button onClick={() => handleSubmit(username, password)}>Submit</Button>
			</div>
		</div>
	);
}
