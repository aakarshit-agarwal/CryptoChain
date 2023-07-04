import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import { Link } from 'react-router-dom';

const POLL_INTERVAL_MS = 10000;

class TransactionPool extends Component {
    state = { transactionPoolMap: {} };

    render() {
        return (
            <div className='TransactionPool'>
                <div>
                    <Link to='/'>Home</Link>
                </div>
                <h3>Transaction Pool</h3>
                {Object.values(this.state.transactionPoolMap).map(
                    (transaction) => {
                        return (
                            <div key={transaction.id}>
                                <hr></hr>
                                <Transaction
                                    transaction={transaction}
                                ></Transaction>
                            </div>
                        );
                    }
                )}
                <hr></hr>
                <Button bsStyle='danger' onClick={this.mineTransactions}>
                    Mine Transactions
                </Button>
            </div>
        );
    }

    componentDidMount() {
        this.fetchTransactionsInPool();

        this.fetchTransactionsInPoolInterval = setInterval(() => {
            this.fetchTransactionsInPool();
        }, POLL_INTERVAL_MS);
    }

    componentWillUnmount() {
        clearInterval(this.fetchTransactionsInPoolInterval);
    }

    fetchTransactionsInPool = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then((response) => response.json())
            .then((json) => this.setState({ transactionPoolMap: json }));
    };

    mineTransactions = () => {
        fetch(`${document.location.origin}/api/mine-transactions`).then(
            (response) => {
                if (response.status === 200) {
                    alert('success');
                } else {
                    alert(
                        'The mine-transactions block request did not complete.'
                    );
                }
            }
        );
    };
}

export default TransactionPool;
