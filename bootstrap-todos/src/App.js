import "./App.css";
import CreateList from "./component/list/CreateList";
import CreateTodos from "./component/create/CreateTodos";
import ViewTodos from "./component/create/ViewTodos";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/:id" component={CreateList}></Route>
          <Route exact path="/" component={CreateList}></Route>

          <Route
            exact
            path="/create/ViewTodos/:viewId"
            component={ViewTodos}
          ></Route>
          <Route
            exact
            path="/create/CreateTodos/:editId"
            component={CreateTodos}
          ></Route>
          <Route
            exact
            path="/create/CreateTodos"
            component={CreateTodos}
          ></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
