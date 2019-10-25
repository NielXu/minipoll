import React from 'react';
import { InputGroup, Form, Button, ProgressBar } from 'react-bootstrap';
 
export default class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rid: this.props.match.params.rid,
            loading: true,
            private: false,
            auth: false,
            passwordMsg: "",
            password: "",
            data: "",
            voted: false,
            exists: true,
        }
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onEnterClick = this.onEnterClick.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
    }

    componentDidMount() {
        if(this.props.location.password) {
            this.fetchPrivateRoom();
        }
        else {
            this.fetchRoom();
        }
    }

    fetchPrivateRoom() {
        this.setState({private: true});
        fetch(`/api/v1/rooms/${this.props.match.params.rid}?password=${this.props.location.password}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(response.status === 401) {
                throw "Incorrect password";
            }
            return response.json();
        })
        .then(data => {
            this.setState({loading: false, auth:true, data: data.data});
        })
        .catch(error => {
            this.setState({error: error, loading: false});
        })
    }

    fetchRoom() {
        fetch(`/api/v1/rooms/${this.props.match.params.rid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(response.status === 400) {
                this.setState({private: true});
                throw "Password required";
            }
            return response.json();
        })
        .then(data => {
            if(data.message === 'Room not found with given id') {
                this.setState({exists: false});
            }
            else {
                this.setState({data: data.data});
            }
            this.setState({loading: false});
        })
        .catch(error => {
            this.setState({error: error, loading: false});
        })
    }

    onEnterClick(e) {
        e.preventDefault();
        this.setState({validated: true});
        const password = this.state.password;
        if(password === "") {
            this.setState({passwordMsg: "Password cannot be empty"});
        }
        else {
            this.setState({loading: true});
            fetch(`/api/v1/rooms/${this.props.match.params.rid}?password=${this.state.password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if(response.status === 401) {
                    throw "Incorrect password";
                }
                return response.json();
            })
            .then(data => {
                this.setState({loading: false, auth:true, data: data.data});
            })
            .catch(error => {
                this.setState({passwordMsg: error, loading: false});
            })
        }
    }

    onPasswordChange(e) {
        this.setState({password: e.target.value});
    }

    renderProgressBar() {
        let total = 0;
        let elements = [];
        const options = this.state.data.options;
        let dist = {};
        for(var key in options) {
            total += options[key];
        }
        for(var key in options) {
            if(options[key] === 0) {
                dist[key] = 0;
            }
            else{
                dist[key] = options[key] / total;
            }
            elements.push(
                <div className="progress-bar">
                    <ProgressBar now={dist[key] * 100} label={`${options[key]} (${Math.round(dist[key] * 100)}%)`}/>
                </div>
            )
        }
        return elements;
    }

    renderOptions() {
        let elements = [];
        const options = this.state.data.options;
        for(var key in options) {
            elements.push(<Button variant="outline-primary" data-key={key} onClick={this.onOptionClick}>{key}</Button>);
        }
        return elements;
    }

    onOptionClick(event) {
        const key = event.target.getAttribute("data-key");
        let data = this.state.data;
        data.options[key] = data.options[key] + 1;
        this.setState({data: data});
        fetch(`/api/v1/rooms/${this.props.match.params.rid}?password=${this.state.password}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.data),
        })
        .then(response => {
            if(response.status === 400) {
                throw "Password required";
            }
            else if(response.status === 401) {
                throw "Incorrect password";
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            this.setState({voted: true});
        })
        .catch(error => {
            console.log(error);
        });
    }

    render() {
        if(this.state.private && !this.state.auth) {
            return (
                <div>
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Password</InputGroup.Text>
                            </InputGroup.Prepend>
                        <Form.Control
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                            type="password"
                            required
                            onChange={this.onPasswordChange}
                            autoFocus
                        />
                        <Button variant="primary" onClick={this.onEnterClick} type="submit">Enter</Button>
                        {this.state.passwordMsg && <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{this.state.passwordMsg}</Form.Control.Feedback>}
                        </InputGroup>
                    </Form>
                </div>
            )
        }
        else {
            if(!this.state.exists) {
                return (
                    <div>
                        <h2>Room does not exists</h2>
                    </div>
                )
            }
            if(this.state.voted) {
                return (
                    <div>
                        <h2>{this.state.data.title}</h2>
                        <h3>{this.state.data.description&& this.state.data.description}</h3>
                        {this.renderProgressBar()}
                    </div>
                )
            }
            return (
                <div>
                    <h2>{this.state.data.title}</h2>
                    <h3>{this.state.data.description&& this.state.data.description}</h3>
                    {this.renderOptions()}
                </div>
            )
        }
    }
}