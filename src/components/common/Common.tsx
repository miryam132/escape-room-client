export function ErrorMessage({errorMessage}: { errorMessage: string }) { 
    return(
        <div className="error-message">
            <p role="alert">{errorMessage}</p>
        </div> 
    )
}


export function Loading() {
    return (
        <div className="loading">
            <p>Loading...</p>
        </div>
    )
}


export function SuccessMessage({successMessage}: { successMessage: string }) {
    return (
        <div className="success-message">
            <p role="status">{successMessage}</p>
        </div>
    )

}

export function Badge({text}: {text: string}) {
    return (
        <span className="badge">{text}</span>
    )
}


// disabled
export function Button({text, onClick}:{text:string, onClick:()=>void}) {
    return(
        <button onClick={onClick} type="button">
            {text}
        </button>
    )
}

export function TextInput({id,label,value,onChange,placeholder}:
    {id:string,label:string,value:string,onChange:(value: string)=>void,placeholder?:string}){
        return(
            <div>
                <label htmlFor={id}>{label}</label>  
                <input type="text" id={id} value ={value} placeholder={placeholder} onChange={(e)=>onChange(e.target.value)} />  
            </div>
        )
    }