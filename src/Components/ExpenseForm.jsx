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
  const [filteredMonth, setFilteredMonth] = useState(""); // New state for month filter

  const [customCategory, setCustomCategory] = useState(""); // New state for custom category input

  const categories = [
    "Food",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Medical Aid",
    "Education",
    "Takeouts",
    "Other",
  ];

  // Use this function to calculate the total amount for the selected category
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

    // If category is changed to "Other", clear custom category input
    if (e.target.name === "category" && e.target.value !== "Other") {
      setCustomCategory(""); // Reset custom category input if another category is selected
    }
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const handleCategoryFilterChange = (e) => {
    const selectedCategory = e.target.value;
    setFilteredCategory(selectedCategory);

    if (selectedCategory) {
      // Filter the expenses based on the selected category
      const filtered = expenses.filter(
        (expense) =>
          expense.Category.trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase()
      );

      setFilteredExpenses(filtered);

      // Calculate the total amount for the filtered category
      const total = filtered.reduce(
        (sum, expense) => sum + parseFloat(expense.Amount),
        0
      );
      setFilteredTotal(total);
    } else {
      // Reset to show all expenses and totals if no category is selected
      setFilteredExpenses(expenses);
      setFilteredTotal(totalExpense);
    }
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
        setExpenses(data || []); // Ensure expenses is always an array
        setFilteredExpenses(data || []);

        if (data.length === 0) {
          // If no expenses, reset totals to 0
          setTotalExpense(0);
          setFilteredTotal(0);
        } else {
          // Calculate totals if there are expenses
          const total = data.reduce(
            (sum, expense) => sum + parseFloat(expense.Amount),
            0
          );
          setTotalExpense(total);

          // Recalculate filtered total if category is set
          if (filteredCategory) {
            const filteredTotal = calculateFilteredTotal(
              data,
              filteredCategory
            );
            setFilteredTotal(filteredTotal);
          } else {
            setFilteredTotal(total); // Set total for all expenses
          }
        }
      } else {
        console.error("Failed to fetch expenses. Status:", response.status);
        setExpenses([]); // Fallback to empty state on error
        setFilteredExpenses([]);
        setTotalExpense(0); // Reset totals if fetch fails
        setFilteredTotal(0);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]); // Fallback to empty state on error
      setFilteredExpenses([]);
      setTotalExpense(0); // Reset totals on error
      setFilteredTotal(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use custom category if "Other" is selected
    const selectedCategory =
      formData.category === "Other" ? customCategory : formData.category;

    if (formData.name && formData.amount && formData.date && selectedCategory) {
      const userEmail = localStorage.getItem("userEmail");
      const userFirstName = localStorage.getItem("userName");

      const expenseData = {
        ExpenseName: formData.name,
        Amount: parseFloat(formData.amount),
        Date: formData.date,
        Category: selectedCategory,
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
        fetchExpenses(); // Re-fetch expenses after adding a new one
        setFormData({ name: "", amount: "", date: "", category: "" });
        setCustomCategory(""); // Reset custom category input after form submission
      } else {
        alert("Error: Unable to add expense.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleDelete = async (expenseId) => {
    console.log("Attempting to delete expense with ID:", expenseId);

    try {
      const userEmail = localStorage.getItem("userEmail");

      // Check if expenseId is valid
      if (!expenseId) {
        console.error("Invalid expense ID:", expenseId);
        alert("Error: Invalid expense ID.");
        return;
      }

      const response = await fetch(
        `https://localhost:44351/api/connectDB/DeleteExpense/${expenseId}?userEmail=${encodeURIComponent(userEmail)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Re-fetch the updated expenses after deletion
        await fetchExpenses(); // Use the already declared fetchExpenses function

        alert("Expense deleted successfully.");
      } else {
        const error = await response.text();
        console.error(
          "Error deleting expense. Status:",
          response.status,
          error
        );
        alert("Error: Unable to delete expense.");
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("Error: Unable to delete expense.");
    }
  };

  const handleMonthFilterChange = (e) => {
    const selectedMonth = e.target.value;
    setFilteredMonth(selectedMonth);
  };

  useEffect(() => {
    fetchExpenses(); // Re-fetch expenses when component is mounted
  }, []);

  useEffect(() => {
    let filtered = expenses;

    // Filter by category if it's selected
    if (filteredCategory) {
      filtered = filtered.filter(
        (expense) =>
          expense.Category.trim().toLowerCase() ===
          filteredCategory.trim().toLowerCase()
      );
    }

    // Filter by month if it's selected
    if (filteredMonth) {
      const [year, month] = filteredMonth.split("-");
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.Date);
        const expenseYear = expenseDate.getFullYear();
        const expenseMonth = (expenseDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");

        return expenseYear === parseInt(year) && expenseMonth === month;
      });
    }

    // Update filtered expenses and the total for the filtered expenses
    setFilteredExpenses(filtered);

    const total = filtered.reduce(
      (sum, expense) => sum + parseFloat(expense.Amount),
      0
    );
    setFilteredTotal(total);
  }, [expenses, filteredCategory, filteredMonth]); // Run when expenses, filteredCategory, or filteredMonth change

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

      {/* Month Filter */}
      <div className="mb-5">
        <label htmlFor="monthFilter" className="font-medium mr-2">
          Filter by Month:
        </label>
        <select
          id="monthFilter"
          value={filteredMonth}
          onChange={handleMonthFilterChange}
          className="p-2 rounded-md border"
        >
          <option value="">All Months</option>
          {expenses.map((expense) => {
            const expenseDate = new Date(expense.Date);
            const yearMonth = `${expenseDate.getFullYear()}-${(
              expenseDate.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}`;

            return (
              <option key={yearMonth} value={yearMonth}>
                {expenseDate.toLocaleString("default", {
                  year: "numeric",
                  month: "long",
                })}
              </option>
            );
          })}
        </select>
      </div>

      {/* Expense Form */}
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-sm p-5 bg-black flex-col flex items-center justify-center gap-3 rounded-xl shadow-green-500 shadow-lg text-white"
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

        {formData.category === "Other" && (
          <input
            type="text"
            name="customCategory"
            placeholder="Enter Custom Category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="p-2 rounded-md w-full"
          />
        )}
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded-md mt-3"
        >
          Add Expense
        </button>
      </form>

      <div className="mt-10">
        {filteredExpenses.length === 0 && filteredCategory ? (
          <p>
            No expenses available for the selected category: {filteredCategory}.
          </p>
        ) : (
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="border border-gray-300 p-2">Expense Name</th>
                <th className="border border-gray-300 p-2">Amount</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Category</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.Id}>
                  <td className="border border-gray-300 p-2">
                    {expense.ExpenseName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {expense.Currency} {parseFloat(expense.Amount).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatDate(expense.Date)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {expense.Category}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleDelete(expense.ExpenseID)} // Pass ExpenseID here
                      className="bg-red-500 text-white p-2 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Display Total Expenses */}
      <div className="mt-5">
        <h2 className="font-bold">
          {filteredCategory
            ? `Total Expense for ${filteredCategory}:`
            : "Total Expense:"}
        </h2>
        <p>
          {currency} {filteredTotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ExpenseTracker;
