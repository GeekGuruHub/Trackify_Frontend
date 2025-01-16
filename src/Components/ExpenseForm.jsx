import { useState, useEffect } from "react";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
  });
  const [totalExpense, setTotalExpense] = useState(0); // State for total expenses
  const [currency, setCurrency] = useState("R"); // State for selected currency

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  // Format the date to show only the date (YYYY-MM-DD)
  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-GB"); // Adjust locale as needed
  };

  // Fetch all expenses and calculate total
  const fetchExpenses = async () => {
    const response = await fetch("https://localhost:44351/api/connectDB/GetAllExpenses");
    if (response.ok) {
      const data = await response.json();
      console.log("Fetched Expenses:", data); // Add this log to check the data structure
      setExpenses(data);
      const total = data.reduce((sum, expense) => sum + parseFloat(expense.Amount), 0);
      setTotalExpense(total);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that required form fields are filled
    if (formData.name && formData.amount && formData.date) {
        // Retrieve user info from localStorage
        const userEmail = localStorage.getItem("userEmail");
        const userFirstName = localStorage.getItem("userName");

        console.log("email:", userEmail);
        console.log("fn:", userFirstName);

        // Construct the expense data, including user info
        const expenseData = {
            ExpenseName: formData.name,
            Amount: parseFloat(formData.amount),  // Ensure amount is parsed as float
            Date: formData.date,
            Currency: currency,
            UserEmail: userEmail,           // Add user email
            UserFirstName: userFirstName    // Add user first name
        };

        // Send the expense data to the backend
        const response = await fetch("https://localhost:44351/api/connectDB/addExpense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expenseData),
        });

        if (response.ok) {
            // After adding the expense, fetch all expenses and recalculate the total
            fetchExpenses();
            setFormData({ name: "", amount: "", date: "" });
        } else {
            // Handle any errors if the request is not successful
            alert("Error: Unable to add expense.");
        }
    } else {
        // Display an alert if required fields are missing
        alert("Please fill in all required fields.");
    }
};


const handleDelete = async (id, amount) => {
  try {
    console.log("Expense ID passed to delete:", id);
    
    const userEmail = localStorage.getItem("userEmail");
    console.log("User email from localStorage:", userEmail);

    // Validate that both id and userEmail exist
    if (!id || !userEmail) {
      alert("Expense ID or User Email is missing.");
      return;
    }

    // Send DELETE request to the backend
    const response = await fetch(`https://localhost:44351/api/connectDB/DeleteExpense/${id}?userEmail=${userEmail}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Expense deleted successfully");
      // Update the state by removing the deleted expense
      setExpenses(expenses.filter((expense) => expense.ExpenseID !== id));
      // Update the total expense
      setTotalExpense((prevTotal) => prevTotal - parseFloat(amount));
    } else {
      const errorData = await response.json();
      console.error("Error deleting expense:", errorData.message);
      alert(`Error deleting expense: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while deleting the expense.");
  }
};


  useEffect(() => {
    fetchExpenses(); // Fetch expenses on component mount
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>

      {/* Currency Selector */}
      <div className="mb-5">
        <label htmlFor="currency" className="font-medium mr-2">
          Select Currency:
        </label>
        <select
          id="currency"
          value={currency}
          onChange={handleCurrencyChange}
          className="p-2 rounded-md border"
        >
          <option value="ZAR">ZAR (R)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="INR">INR (₹)</option>
          <option value="JPY">JPY (¥)</option>
        </select>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-black flex-col flex items-center justify-center gap-3 rounded-xl shadow-green-500 shadow-lg text-white"
      >
        <input
          type="text"
          name="name"
          placeholder="Expense Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 rounded-md w-full"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="p-2 rounded-md w-full"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="p-2 rounded-md w-full"
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded-md mt-3"
        >
          Add Expense
        </button>
      </form>

      <div className="mt-10">
        {expenses.length > 0 ? (
          <div>
            <table className="table-auto border-collapse border border-gray-300 w-full text-left">
              <thead>
                <tr className="bg-green-500 text-white">
                  <th className="border border-gray-300 p-2">Expense Name</th>
                  <th className="border border-gray-300 p-2">Amount</th>
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.ExpenseID} className="hover:bg-gray-900">
                    <td className="border border-gray-300 p-2">{expense.ExpenseName}</td>
                    <td className="border border-gray-300 p-2">{currency} {expense.Amount} </td>
                    <td className="border border-gray-300 p-2">{formatDate(expense.Date)}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => handleDelete(expense.ExpenseID, expense.Amount)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {/* Total Expense Display */}
            <div className="text-right mt-4">
              <h2 className="text-xl font-bold">
                Total Expense: {currency} {totalExpense.toFixed(2)}
              </h2>
            </div>
          </div>
        ) : (
          <p>No expenses added yet</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
