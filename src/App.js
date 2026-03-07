import { BrowserRouter } from "react-router-dom";
import Sidebar from "./component/Sidebar";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Sidebar/>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
