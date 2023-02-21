import { useState } from "react";
import axios from "axios";

const baseURL = "http://localhost:8000/amz_items/";

const Card = (props) => {
    return (
        <div>
            <p><b>asin: {props.asin}</b> model: {props.model}</p>
        </div>
    )
}

const Home = () => {
    const [asin, setAsin] = useState("");
    const [model, setModel] = useState("");
    const [fetched, setFetched] = useState(false);
    const [data, setData] = useState([])

    const handleGetAll = () => {
        axios.get(baseURL).then((response) => {
            setFetched(true);
            const result = JSON.parse(response.data);
            setData(result);
        })
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
        </div>
    );
}

export default Home;
