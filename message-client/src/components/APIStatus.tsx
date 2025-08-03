import React, { useEffect, useState } from "react";
import { getRequest } from "../utils/api";

const APIStatus: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        const response = await getRequest<{ message: string }>("/test");
        setStatus(response.message);
      } catch (err) {
        setError("❌ Failed to connect to the API.");
        console.error(err);
      }
    };

    checkDatabaseConnection();
  }, []);

  return (
    <div>
      <label>API Connection Status: </label>
      {status && <span style={{ color: "green" }}>{status}</span>}
      {error && <span style={{ color: "red" }}>{error}</span>}

    </div>
  );
};

export default APIStatus;
