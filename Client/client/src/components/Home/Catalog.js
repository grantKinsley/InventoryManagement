import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { Navigate } from "react-router-dom";

var fileDownload = require("js-file-download");

const baseURL = "http://localhost:8000/amz_items/";

const Card = (props) => {
  return (
    <div style={{ padding: 10 }}>
      <div>
        <b>ASIN: {props.asin}</b>{" "}
      </div>
      <div>Model: {props.model} </div>
      <div>Selling Price: {props.sellingPrice} </div>
      <div>Cost to Produce Unit: {props.cost} </div>
      <div>Inventory Count: {props.amzInv} </div>
    </div>
  );
};

const Catalog = () => {
  const [asin, setAsin] = useState("");
  const [model, setModel] = useState("");
  const [fetched, setFetched] = useState(false);
  const [data, setData] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      // console.log(auth.token);
      const accessToken = sessionStorage.getItem("serverToken");
      const response = await axios.get(baseURL, {
        headers: { "Content-Type": "application/json", Bearer: accessToken },
      });
      setFetched(true);
      const result = JSON.parse(response.data);
      // console.log(result);
      setData(result);
    };
    fetchData().catch(console.error);
  }, []);

  const downloadCSV = async (e) => {
    const reportURL = baseURL + "report";
    const response = await axios
      .get(reportURL, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, "fileName.CSV");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleGetOne = (e) => {
    const fetchOne = async () => {
      const url = baseURL + asin;
      console.log(url);
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json", Bearer: auth.token },
      });
      setFetched(true);
      const result = JSON.parse(response.data);
      result[0].push({ getOne: "true" });
      setData(result);
    };
    fetchOne().catch(console.error);
  };

  if (sessionStorage.getItem("serverToken") === null) {
    return <Navigate to="/login" />;
  }

  if (fetched) {
    return (
      <div>
        <form>
          <label>
            Search by Asin:
            <input
              type="text"
              name="asin"
              onChange={(e) => {
                setAsin(e.target.value);
              }}
            />
          </label>
          <button onClick={handleGetOne}>Search</button>
        </form>
        {data.map((datum) => {
          return (
            <Card
              key={datum.ASIN}
              asin={datum.ASIN}
              model={datum.model}
              sellingPrice={datum.sellingPrice}
              cost={datum.cost}
              amzInv={datum.amzInv}
            />
          );
        })}

        <button onClick={downloadCSV}>Download CSV</button>
      </div>
    );
  }
};

export default Catalog;
