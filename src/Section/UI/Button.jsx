function Button({isLoading, children}) {
    return ( <div>
        <button>
           {isLoading ? ( <span>
            <svg> 
                <circle />
                <path />
            </svg>
             Loading...</span>) : (children)} 
        </button>
        </div>
    )
}

export default Button;