function ExpesnseItem({name, amount, date}){
  
    return(
        <div>
            <div>{name}</div>
            <div>{amount}</div>
            <div>{date}</div>
            <br/>  
            <button>Submit</button>
        </div>

    );

}

export default ExpesnseItem;