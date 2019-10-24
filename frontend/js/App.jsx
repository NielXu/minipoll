import React from 'react';
import { ProgressBar } from 'react-bootstrap';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            now: 50
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({now: this.state.now + 1});
        }, 1000);
    }

    render() {
        return (
            <div>
                <ProgressBar now={this.state.now} label={`${this.state.now}%`}/>
            </div>
        )
    }
}