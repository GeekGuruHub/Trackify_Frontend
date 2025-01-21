import { useState, useEffect } from "react";
import { data } from "react-router-dom";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
    category: "", // Add category to formData
  });
  const [totalExpense, setTotalExpense] = useState(0); // State for total expenses
  const [currency, setCurrency] = useState("R"); // State for selected currency

  const categories = ["Food", "Transportation", "Entertainment", "Utilities", "Healthcare", "Education", "Takeouts","Other"]; // Predefined categories

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
    try {
      const userEmail = localStorage.getItem("userEmail"); // Retrieve the userEmail from localStorage
      const url = userEmail
        ? `https://localhost:44351/api/connectDB/GetAllExpenses?userEmail=${encodeURIComponent(userEmail)}`
        : "https://localhost:44351/api/connectDB/GetAllExpenses"; // Fallback to fetch all expenses if userEmail is not set

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data); // Update the state with the fetched expenses
        // Calculate and update the total expense
        const total = data.reduce((sum, expense) => sum + parseFloat(expense.Amount), 0);
        setTotalExpense(total);
      } else {
        console.error("Failed to fetch expenses. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that required form fields are filled
    if (formData.name && formData.amount && formData.date && formData.category) {
      // Retrieve user info from localStorage
      const userEmail = localStorage.getItem("userEmail");
      const userFirstName = localStorage.getItem("userName");

      console.log("email:", userEmail);
      console.log("fn:", userFirstName);

      // Construct the expense data, including user info
      const expenseData = {
        ExpenseName: formData.name,
        Amount: parseFloat(formData.amount), // Ensure amount is parsed as float
        Date: formData.date,
        Category: formData.category, // Include category
        Currency: currency,
        UserEmail: userEmail, // Add user email
        UserFirstName: userFirstName, // Add user first name
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
        setFormData({ name: "", amount: "", date: "", category: "" });
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
      const userEmail = localStorage.getItem("userEmail");

      // Validate that both id and userEmail exist
      if (!id || !userEmail) {
        alert("Expense ID or User Email is missing.");
        console.log("id: " + id, "userName: " + userEmail)
        return;
      }

      // Send DELETE request to the backend
      const response = await fetch(`https://localhost:44351/api/connectDB/DeleteExpense/${id}?userEmail=${userEmail}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update the state by removing the deleted expense
        setExpenses(expenses.filter((expense) => expense.ExpenseID !== id));
        // Update the total expense
        setTotalExpense((prevTotal) => prevTotal - parseFloat(amount));
      } else {
        const errorData = await response.json();
        alert(`Error deleting expense: ${errorData.message}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the expense.");
    }
  };

  const [budget, setBudget] = useState(0);
  const [budgetExists, setBudgetExists] = useState(false);

  const fetchBudget = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      const response = await fetch(`https://localhost:44351/api/connectDB/GetBudget?userEmail=${encodeURIComponent(userEmail)}`);
      console.log("user name: " + userEmail);
      
      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
        if (data.Budget !== undefined && data.Budget !== null) {
          setBudget(data.Budget); // Set the budget to state
          setBudgetExists(true); // Set budgetExists to true
        } else {
          setBudgetExists(false); // No budget, set to false
        }
        } else {
        console.error("Failed to fetch budget.");
      }
      console.log(data.budget);
    }
  };
  
  
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      fetchExpenses(); // Fetch expenses when the component mounts
      fetchBudget();   // Fetch budget when the component mounts
    }
  }, []);
  

  const updateBudget = async (newBudget) => {
    const userEmail = localStorage.getItem("userEmail");
    
    // Send the new budget to the backend
    const response = await fetch("https://localhost:44351/api/connectDB/UpdateBudget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UserEmail: userEmail, Budget: newBudget }),
    });
  
    if (response.ok) {
      // After successful update, update the budget state
      setBudget(newBudget);
      setBudgetExists(true); // Ensure that budgetExists is set to true
      alert("Budget updated successfully.");
    } else {
      alert("Failed to update budget.");
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
  
    const newBudget = parseFloat(e.target.budget.value);
    if (!isNaN(newBudget) && newBudget > 0) {
      if (budgetExists) {
        // If budget already exists, update it
        updateBudget(newBudget);
      } else {
        // If no budget exists, set a new budget
        updateBudget(newBudget);
      }
    } else {
      alert("Please enter a valid budget amount.");
    }
  };

  // Fetch budget after component mounts and after a budget is updated
  useEffect(() => {
    fetchBudget();  // Fetch budget when the component mounts
  }, [budgetExists]);  // Add dependency on `budgetExists` to re-fetch after update

  let budgetDisplay;

    if (budgetExists) {
      budgetDisplay = budget.toFixed(2); // Convert the budget to a string with 2 decimal places
    } 
    else {
      budgetDisplay = "Loading..."; // Show loading if budget doesn't exist yet
    }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>
      <br />

      <div className="mt-5">
        <h2 className="text-xl font-bold">Set Your Budget</h2>
        <form
          onSubmit={handleBudgetSubmit}  // Use the handleBudgetSubmit function
          className="mt-3 flex items-center gap-2"
          >
          <input
            type="number"
            name="budget"
            placeholder="Enter budget"
            defaultValue={budget} // Display current budget as the default value
            className="p-2 rounded-md border"
            />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
          { budgetExists ? "Update Budget" : "Save Budget"}  {/* Update button text based on budget existence */}
          </button>
        </form>

      </div>


      <br/>
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
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="p-2 rounded-md w-full"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
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
                  <th className="border border-gray-300 p-2">Category</th>
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.ExpenseID} className="hover:bg-gray-900">
                    <td className="border border-gray-300 p-2">{expense.ExpenseName}</td>
                    <td className="border border-gray-300 p-2">
                      {currency} {expense.Amount}
                    </td>
                    <td className="border border-gray-300 p-2">{expense.Category}</td>
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

            <div className="mt-5">
              <h2 className="text-xl font-bold">
                Budget: {currency} {budget !== null ? budget.toFixed(2) : "0.00"}
              </h2>
              <h2
                className={`text-xl font-bold ${
                  budget - totalExpense < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                Remaining: {currency} {(budget - totalExpense).toFixed(2)}
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
