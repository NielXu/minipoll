import React from 'react';
import { Button } from 'react-bootstrap';
import '../../css/trending.css';

export default class Trending extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
        }
    }

    componentDidMount() {
        fetch(`/api/v1/rooms?sortby=${"total"}&limit=${10}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.json();
        })
        .then(js => {
            // A list of rooms, maximum ten
            this.setState({data: js.data});
        })
    }

    renderTops() {
        let elements = [];
        for(var i=0;i<this.state.data.length;i++) {
            elements.push(
                <div className="trending-item">
                    <Button variant="link">{this.state.data[i].title}</Button>
                </div>
            )
        }
        return elements;
    }


    render() {
        return (
            <div id="side">
                <div id="side-title"><h3>Trending</h3></div>
                {this.renderTops()}
            </div>
        )
    }
}