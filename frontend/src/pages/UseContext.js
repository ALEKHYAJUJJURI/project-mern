import { createContext } from "react"

export function ContextCompo(){
    const UseContext = createContext()
    return(
        <div>
            <h3>Context</h3>
        </div>
    )
}