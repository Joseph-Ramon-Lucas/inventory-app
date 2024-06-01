import { useState } from "react";
import "../App.css";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";


export function CreateAccount() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div>
            <h1>Create your Cabinet Account</h1>
            
            <Input></Input>
        </div>
    )
}