import React from "react";
import { useNavigate } from "react-router-dom";
import Not from "../static/403.svg";

const Unauth = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="bg-light vh-100 d-flex justify-content-center align-items-center text-center">
      <div>
        <h1 className="text-center m-5">Unauthorized Access!</h1>
        <img src={Not} alt="unauthorized" />
        <p className="text-center fw-bolder m-3">
          You do not have access to the requested page
        </p>
        <button className="btn btn-danger text-white my-2" onClick={goBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauth;
