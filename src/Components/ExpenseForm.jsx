import { useState, useEffect } from "react";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
    category: "",
  });
  const [totalExpense, setTotalExpense] = useState(0);
  const [currency, setCurrency] = useState("R");
  const [filteredCategory, setFilteredCategory] = useState(""); // New state for category filter
  const [filteredTotal, setFilteredTotal] = useState(0); // New state for filtered total

  const categories = [
    "Food",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Education",
    "Takeouts",
    "Other",
  ];

  // Helper function to calculate total for the filtered category
  const calculateFilteredTotal = (expensesList, category) => {
    if (!category) return 0; // No category selected
    const filteredExpenses = expensesList.filter(
      (expense) => expense.Category === category
    );
    return filteredExpenses.reduce(
      (sum, expense) => sum + parseFloat(expense.Amount),
      0
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const handleCategoryFilterChange = (e) => {
    const selectedCategory = e.target.value;
    setFilteredCategory(selectedCategory);
  
    // Filter expenses based on selected category
    if (selectedCategory) {
      const filtered = expenses.filter(
        (expense) => expense.Category === selectedCategory
      );
      setFilteredExpenses(filtered); // Update filtered expenses
    } else {
      setFilteredExpenses(expenses); // Reset to show all expenses
    }
  
    // Calculate filtered total for the selected category
    const total = calculateFilteredTotal(expenses, selectedCategory);
    setFilteredTotal(total);
  };
  
  
  

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-GB");
  };

  const fetchExpenses = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const url = userEmail
        ? `https://localhost:44351/api/connectDB/GetAllExpenses?userEmail=${encodeURIComponent(userEmail)}`
        : "https://localhost:44351/api/connectDB/GetAllExpenses";
  
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data); // Set all expenses
        setFilteredExpenses(data); // Set filtered expenses to all initially
  
        // Calculate total for all expenses
        const total = data.reduce(
          (sum, expense) => sum + parseFloat(expense.Amount),
          0
        );
        setTotalExpense(total); // Set total expense for all expenses
  
        // Calculate filtered total if a category is selected
        if (filteredCategory) {
          const filteredTotal = calculateFilteredTotal(data, filteredCategory);
          setFilteredTotal(filteredTotal);
        }
      } else {
        console.error("Failed to fetch expenses. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name && formData.amount && formData.date && formData.category) {
      const userEmail = localStorage.getItem("userEmail");
      const userFirstName = localStorage.getItem("userName");

      const expenseData = {
        ExpenseName: formData.name,
        Amount: parseFloat(formData.amount),
        Date: formData.date,
        Category: formData.category,
        Currency: currency,
        UserEmail: userEmail,
        UserFirstName: userFirstName,
      };

      const response = await fetch(
        "https://localhost:44351/api/connectDB/addExpense",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expenseData),
        }
      );

      if (response.ok) {
        fetchExpenses();
        setFormData({ name: "", amount: "", date: "", category: "" });
      } else {
        alert("Error: Unable to add expense.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const response = await fetch(
        `https://localhost:44351/api/connectDB/DeleteExpense/${expenseId}?userEmail=${encodeURIComponent(userEmail)}`,
        {
          method: "DELETE",
        }
      );
  
      if (response.ok) {
        console.log(expenseId, userEmail);
        // Refresh the expenses list after deletion
        fetchExpenses();
      } else {
        alert("Error: Unable to delete expense.");
        console.log("ExpenseID:", expenseId, "UserEmail:", userEmail);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };
  
  

  useEffect(() => {
    fetchExpenses();
  }, []); // Empty dependency array ensures it runs only on initial load
  
  useEffect(() => {
    // Calculate total for all expenses (always)
    const total = expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.Amount),
      0
    );
    setTotalExpense(total); // Update total for all expenses
  }, [expenses]); // Recalculate whenever expenses change
  
  useEffect(() => {
    // Calculate the filtered total based on the filtered expenses
    const total = filteredExpenses.reduce(
      (sum, expense) => sum + parseFloat(expense.Amount),
      0
    );
    setFilteredTotal(total); // Update total for the filtered category
  }, [filteredExpenses]); // Recalculate when filtered expenses change
  
  

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>
      <br />

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

      {/* Category Filter */}
      <div className="mb-5">
        <label htmlFor="categoryFilter" className="font-medium mr-2">
          Filter by Category:
        </label>
        <select
          id="categoryFilter"
          value={filteredCategory}
          onChange={handleCategoryFilterChange}
          className="p-2 rounded-md border"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-sm p-5 bg-black flex-col flex items-center justify-center gap-3 rounded-xl shadow-green-500 shadow-lg text-white"
      >
        {/* Expense Form */}
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
        {filteredExpenses.length > 0 ? (
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
                {filteredExpenses.map((expense) => (
                  <tr key={expense.ExpenseID} className="hover:bg-gray-900">
                    <td className="border border-gray-300 p-2">{expense.ExpenseName}</td>
                    <td className="border border-gray-300 p-2">
                      {currency} {expense.Amount}
                    </td>
                    <td className="border border-gray-300 p-2">{expense.Category}</td>
                    <td className="border border-gray-300 p-2">{formatDate(expense.Date)}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => handleDelete(expense.ExpenseID)}
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
              {filteredCategory && filteredExpenses.length > 0 && (
                <h2 className="text-lg font-bold text-green-500">
                  Total for {filteredCategory}: {currency} {filteredTotal.toFixed(2)}
                </h2>
              )}
            </div>
          </div>
        ) : (
          <p>No expenses found for the selected category</p>
        )}
      </div>

    </div>
  );
};

export default ExpenseTracker;
