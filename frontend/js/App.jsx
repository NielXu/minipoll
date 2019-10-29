import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Home from './components/home';
import Room from './components/room';
import '../css/root.css';

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/:rid" component={Room}></Route>
                    <Route path="/" component={Home}></Route>
                </Switch>
            </Router>
        )
    }

}