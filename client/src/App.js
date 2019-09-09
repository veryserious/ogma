import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

class App extends Component {
  // initialize our state
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  componentDidMount() {
    this.getDataFromDb();
  }


  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('http://localhost:3000/api/subjects')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

  render() {
    const { data } = this.state;
    return (
      <Router>
        <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/subjects/">Subjects</Link>
            </li>
          </ul>
        </nav>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Subjects</h2>
        </div>
          <ul>
            {data.length <= 0
              ? 'NO DB ENTRIES YET'
              : data.map((dat) => (
                  <li style={{ padding: '10px' }} key={dat.title}>
                    <span style={{ color: 'gray' }}> id: </span> {dat._id} <br />
                    <span style={{ color: 'gray' }}> title: </span>
                    {dat.title}
                  </li>
                ))}
          </ul>
        </div>

        <Route path="/" exact component={Index} />
        <Route path="/subjects/" component={Subjects} />

      </Router>
    );
  }
}

export default App;