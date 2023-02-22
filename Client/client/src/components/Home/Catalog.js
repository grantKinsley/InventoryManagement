import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context-Api/AuthProvider"
var fileDownload = require('js-file-download');

const baseURL = "http://localhost:8000/amz_items/";

const Card = (props) => {
    return (
        <div>
            <p><b>asin: {props.asin}</b> model: {props.model}</p>
        </div>
    )
}

const Catalog = () => {
    const [asin, setAsin] = useState("");
    const [model, setModel] = useState("");
    const [fetched, setFetched] = useState(false);
    const [data, setData] = useState([])
    const { auth } = useContext(AuthContext);

    const handleGetAll = async e => {
        console.log(auth.token);
        const response = await axios.get(
            baseURL,
            {
                headers: { "Content-Type": "application/json", 
                "Bearer": auth.token },
            }
        );
        setFetched(true);
        const result = JSON.parse(response.data);
        setData(result);

    };
    const downloadCSV = async e => {
        //console.log(auth.token);
        const reportURL = baseURL + "report"
        const response = await axios.get(
            reportURL,
            { 
                responseType: 'blob',
            }
        ).then(res => {
            fileDownload(res.data, 'fileName.CSV');
            console.log(res)
        }).catch(err => {
            console.log(err)
        });

    };

    if (fetched) {
        return (
            <div>
                {data.map((datum) => {
                    return (
                        <Card
                            key={datum.asin}
                            asin={datum.asin}
                            model={datum.model}
                        />)           
                })}

                <button onClick={() => {
                    setFetched(false);
                    setData(null);
                }}>Back</button>
            </div>
        )
    }

    return (
        <div>
            <form>
                <label>Asin:
                    <input 
                        type="text" 
                        name="asin"
                        onChange={(e) => {
                            setAsin(e.target.value);
                        }}
                    />
                </label>
                <label>Model:
                    <input 
                        type="text" 
                        name="model"
                        onChange={(e) => {
                            setModel(e.target.value);
                        }}
                    />
                </label>
                {/* <input type="submit" value="Create"/>
                <input type="submit" value="Get"/>
                <input type="submit" value="Delete"/>
                <input type="submit" value="Patch"/> */}

                {/* <input type="submit" value="Get All"/> */}
            </form>

            <button onClick={handleGetAll}>Get All</button>
            <button onClick={downloadCSV}>Download CSV</button>
        </div>
    );
}

export default Catalog;
