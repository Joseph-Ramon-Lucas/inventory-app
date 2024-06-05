import { useEffect, useState } from "react";
// import "../App.css";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


export function CreateAccount() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        console.log(username)

    }, [username]);
    return (
        <div>
            <h1>Create your Cabinet Account</h1>
            
            <Label htmlFor="email">
Email
            </Label>
            <Input type="text"
                    id="username"
                    placeholder="username"
                    onChange={(event => {
                        setUsername(event.target.value)
                    })}
                    
            ></Input>
        </div>
    )
}