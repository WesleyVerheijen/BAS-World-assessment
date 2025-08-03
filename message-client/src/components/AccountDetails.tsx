import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { OrderContext } from "../data/OrderContext";
import Logout from "./Logout";

const AccountDetails = () => {
  const { user } = useContext(OrderContext);
  const [keyOpen, setKeyOpen] = useState<boolean>(false);

  return (
    <fieldset>
      <header>
        <h2>Account</h2>
      </header>
      <div className="form-row">
        <label>Name</label>
        <span>{user?.name}</span>
      </div>
      <div className="form-row">
        <label>E-mail</label>
        <span>{user?.email}</span>
      </div>
      <div className="form-row vertical">
        <label>Private key</label>
        <div className={`${keyOpen ? 'open' : 'closed'}`} onClick={() => setKeyOpen(!keyOpen)}>
          {localStorage.getItem(`privateKey-${user?.id}`)}
        </div>
      </div>
      <footer>
        <Logout />
      </footer>
    </fieldset>
  );
};

export default AccountDetails;
