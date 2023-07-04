import React, { Component } from 'react';
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
}

export default TransactionPool;
