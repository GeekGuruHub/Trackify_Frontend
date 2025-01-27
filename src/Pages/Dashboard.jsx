import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "../Components/ExpenseForm";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("authToken");
    navigate("/form"); // Redirect user to the login page
  };

  const userName = localStorage.getItem("userName");

  return (
    <Fragment>
      <div className="text-2xl font-semibold">Welcome, {userName}!</div>

      <br />
      <ExpenseForm />

      <br />

      <div>
        <button
          className="w-55 p-2 bg-gray-600 text-black rounded-xl mt-3 hover:bg-green-600 hover:text-white text-sm md:text-base pt-4 pb-4"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </Fragment>
  );
}

export default Dashboard;
