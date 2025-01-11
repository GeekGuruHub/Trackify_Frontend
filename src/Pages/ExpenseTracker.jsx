import ExpesnseItem from "../Components/ExpenseItems";
import  { useState } from "react";


function ExpenseTracker(){

    const [expenses, setExpenses] = useState([]);
    
      const addExpense = (expense) =>{
        setExpenses((prevExpenses) =>{
          return[...prevExpenses, expense];
        });
      };
    
      const handleSubmit = (e) =>{
        e.preventDefault();
        const name = e.target.name.value;
        const amount = e.target.amount.value;
        const date = e.target.date.value;
        addExpense({name,amount,date});
        e.target.reset();
      };

      return(
        <div>
            <h1>Hello</h1>
            <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Expense Name"/>
            <input type="number" name="amount" placeholder="Amount" />
            <input type="date" name="date" placeholder="Date"/>
            <button type="submit">Add Expense</button>
            </form>
            {expenses.map((expense, index) => (
            <ExpesnseItem
                key={index}
                name={expense.name}
                amount={expense.amount}
                date={expense.date}
            />
            ))}
      </div>
      );


}

export default ExpenseTracker