import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider";
import { Navigate } from "react-router-dom";
import "./Catalog.css";
import placeholderImg from "./logo192.png";

var fileDownload = require("js-file-download");

const baseURL = "http://localhost:8000/amz_items/";

const Card = (props) => {
  // return (
  //   <div style={{ padding: 10 }}>
  //     {Object.keys(props.item).map((key) => (
  //       <div key={key}>
  //         {key !== "_id" && key !== "companyId"
  //           ? key + ": " + String(props.item[key])
  //           : ""}
  //       </div>
  //     ))}
  //   </div>
  // );
  // console.log(props.item)
  return (
    <div
      style={{
        padding: 10,
        margin: 10,
        border: "solid",
        borderRadius: 5,
        maxWidth: 350,
      }}
    >
      <div className="card-info-container">
        <img src={placeholderImg} style={{ maxWidth: 50 }} />
        <div>
          <div style={{ fontSize: 20 }}>
            <b>{props.item["Product Title"]}</b>
          </div>
          <div>ASIN: {props.item.ASIN}</div>
        </div>
        <div>{props.item["Sellable On Hand Units"]}</div>
        {/* <div>Sales</div> */}
      </div>
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
      console.log(result);
      setData(result);
    };
    fetchData().catch(console.error);
  }, []);

  const downloadCSV = async (e) => {
    const accessToken = sessionStorage.getItem("serverToken");
    const reportURL = baseURL + "report";
    const response = await axios
      .get(reportURL, {
        responseType: "blob",
        headers:{
          Bearer: accessToken,
        }
      })
      .then((res) => {
        fileDownload(res.data, "fileName.CSV");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteCompanyData = async (e) => {
    const accessToken = sessionStorage.getItem("serverToken");
    const response = await axios.delete(baseURL, {
      headers: { "Content-Type": "application/json", Bearer: accessToken },
    });
    console.log(response);
    setData([]);
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
        <button onClick={downloadCSV}>Download CSV</button>
        <button onClick={deleteCompanyData}>Delete Company Data</button>

        <div className="scrollable-container">
          {data.map((datum) => {
            return <Card item={datum} key={datum.ASIN} />;
          })}
        </div>
      </div>
    );
  }
};

export default Catalog;
