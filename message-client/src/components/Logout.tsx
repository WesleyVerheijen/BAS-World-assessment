import { useContext } from "react";
import { OrderContext } from "../data/OrderContext";

const Logout = () => {
  const { setUser } = useContext(OrderContext);

  const handleClick = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <button type="button" onClick={handleClick}>Log out</button>
  );
};

export default Logout;
