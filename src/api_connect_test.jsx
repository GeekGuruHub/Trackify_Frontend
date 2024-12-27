import React, { useState } from "react";
import axios from "axios";

const FormWithApiTest = () => {
    const [responseData, setResponseData] = useState(null);

    console.log('Button clicked!'); // Debug log
    const handleButtonClick = async () => {
        try {
            const response = await axios.get("https://localhost:44351/api/connectDB/GetAllUsers");
            setResponseData(response.data);
        } catch (error) {
            console.error("Error calling the API:", error);
            setResponseData("Error: Unable to fetch data.");
        }
    };

    return (
        <div className="wrapper">
            <form action="">
                <h1>User Details</h1>
                <div className="input-box">
                    <input type="text" placeholder="Email" />
                </div>

                <div className="input-box">
                    <input type="text" placeholder="First Name" />
                </div>

                <div className="input-box">
                    <input type="text" placeholder="Last Name" />
                </div>

                <div className="input-box">
                    <input type="text" placeholder="Password" />
                </div>

                <button type="submit" id="btnSubmit">
                    Submit
                </button>
                <button
                    type="button" // Use type="button" to prevent form submission
                    id="btnTest"
                    onClick={handleButtonClick}
                >
                    Test
                </button>
            </form>

            {/* Display the response data below the form */}
            {responseData && (
                <div>
                    <h2>API Response:</h2>
                    <p>{JSON.stringify(responseData)}</p>
                </div>
            )}
        </div>
    );
}

export default FormWithApiTest;
