import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class ConductTransaction extends Component {
    state = { recipient: '', amount: 0 };

    render() {
        console.log(this.state);
        return (
            <div className='ConductTransaction'>
                <Link to='/'>Home</Link>
                <h3>Conduct a Transaction</h3>
                <FormGroup>
                    <FormControl
                        input='text'
                        placeholder='Recipient'
                        value={this.state.recipient}
                        onChange={this.updateRecipient}
                    ></FormControl>
                </FormGroup>
                <FormGroup>
                    <FormControl
                        input='number'
                        placeholder='Amount'
                        value={this.state.amount}
                        onChange={this.updateAmount}
                    ></FormControl>
                </FormGroup>
                <div>
                    <Button bsStyle='danger' onClick={this.createTransaction}>
                        Submit
                    </Button>
                </div>
            </div>
        );
    }

    updateRecipient = (event) => {
        this.setState({ recipient: event.target.value });
    };

    updateAmount = (event) => {
        this.setState({ amount: Number(event.target.value) });
    };

    createTransaction = () => {
        const { recipient, amount } = this.state;
        fetch('http://localhost:3000/api/transact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipient, amount }),
        })
            .then((response) => response.json())
            .then((json) => {
                alert(json.message || json.type);
            });
    };
}

export default ConductTransaction;
