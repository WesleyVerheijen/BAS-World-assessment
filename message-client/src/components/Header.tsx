import { faChevronLeft, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../data/OrderContext";
import { Page } from "../utils/Page";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { userName } = useContext(OrderContext);
  const handleBack = () => {
    navigate(-1);
  };
  const handleAccount = () => {
    navigate('/account');
  };
  const handleOrder = () => {
    navigate(Page.Order);
  };
  
  return (
    <header>
      <div>
        {location.pathname === "/" ? null : (
          <button type="button" onClick={handleBack}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}
      </div>
      <img src="/logo.png" />
      <div>
        <button type="button" onClick={handleAccount}>
          <FontAwesomeIcon icon={faUserCircle} />
          <span>{userName ?? (<>&nbsp;</>)}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;