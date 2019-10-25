import React from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            private: false,
            options: [
                {value: "", delete: false},
                {value: "", delete: false},
            ],
            title: "",
            description: "",
            password: "",
            validated: false,
            successRedirect: false,
            rid: "",
        }
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onOptionChange = this.onOptionChange.bind(this);
        this.onPrivateClick = this.onPrivateClick.bind(this);
        this.onAddOptionClick = this.onAddOptionClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onDeleteOptionClick = this.onDeleteOptionClick.bind(this);
    }

    componentDidMount() {

    }

    onPrivateClick() {
        this.setState({private: !this.state.private});
    }

    onAddOptionClick() {
        this.setState({options: this.state.options.concat([{value: "", delete: true}])});
    }

    onDeleteOptionClick(event) {
        const options = [...this.state.options];
        options.splice(event.target.getAttribute("data-index"), 1);
        this.setState({options: options});
    }

    onOptionChange(event) {
        const options = [...this.state.options];
        options[event.target.getAttribute("data-index")].value = event.target.value;
        this.setState({options: options});
    }

    onTitleChange(event) {
        this.setState({title: event.target.value});
    }

    onDescriptionChange(event) {
        this.setState({description: event.target.value});
    }

    onPasswordChange(event) {
        this.setState({password: event.target.value});
    }

    onSubmitClick(event) {
        event.preventDefault();
        this.setState({validated: true});
        if(this.validateForm()) {
            const submit = {
                title: this.state.title,
                description: this.state.description,
                password: this.state.password,
                options: this.extractOptions(this.state.options),
            }
            fetch('/api/v1/rooms/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submit),
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.setState({successRedirect: true, rid: data.rid});
            })
        }
    }

    validateForm() {
        if(this.state.title === "") {
            return false;
        }
        else if(this.state.private && this.state.password === "") {
            return false;
        }
        else {
            const options = this.state.options;
            for(var i=0;i<options.length;i++) {
                if(options[i].value === "") {
                    return false;
                }
            }
            return true;
        }
    }

    extractOptions(opts) {
        let options = [];
        for(var i=0;i<opts.length;i++) {
            options.push(opts[i].value);
        }
        return options;
    }

    renderOptions() {
        var elements = [];
        for(var i=0;i<this.state.options.length;i++) {
            const option = this.state.options[i];
            if(option.delete) {
                elements.push(
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <Button variant="danger" data-index={i} onClick={this.onDeleteOptionClick}>Delete</Button>
                            </InputGroup.Prepend>
                            <Form.Control
                                type="text"
                                placeholder={`Option ${i+1}`}
                                aria-describedby="inputGroupPrepend"
                                onChange={this.onOptionChange}
                                data-index={i}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Option cannot be empty</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                )
            }
            else {
                elements.push(
                    <Form.Group>
                        <Form.Control type="text" data-index={i} placeholder={`Option ${i+1}`} onChange={this.onOptionChange} required/>
                        <Form.Control.Feedback type="invalid">Option cannot be empty</Form.Control.Feedback>
                    </Form.Group>
                );
            }
        }
        return elements;
    }

    render() {
        return (
            <div>
                <Form noValidate validated={this.state.validated}>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Poll Title" onChange={this.onTitleChange} required/>
                        <Form.Control.Feedback type="invalid">Title cannot be empty</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Poll Description (Optional)" onChange={this.onDescriptionChange}/>
                    </Form.Group>
                    <Form.Group>
                        <Button variant="primary" onClick={this.onAddOptionClick}>Add Option</Button>
                    </Form.Group>
                    {this.renderOptions()}
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Private" onClick={this.onPrivateClick} />
                    </Form.Group>
                    {this.state.private && (
                        <Form.Group>
                            <Form.Control type="password" placeholder="Password" onChange={this.onPasswordChange} required/>
                        </Form.Group>
                    )}
                    <Button variant="primary" type="submit" onClick={this.onSubmitClick}>Submit</Button>
                </Form>
                {this.state.successRedirect && <Redirect to={{pathname:`/${this.state.rid}`, password: this.state.password}}/>}
            </div>
        )
    }
}