import React, { Component } from 'react';
import Blocks from './Blocks';

class App extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch('http://localhost:3000/api/wallet-info')
            .then((res) => res.json())
            .then((json) => this.setState({ walletInfo: json }));
    }
    render() {
        const { address, balance } = this.state.walletInfo;
        return (
            <>
                <div>Welcome to blockchain...</div>
                <div>Address: {address}</div>
                <div>Balance: {balance}</div>
                <br></br>
                <Blocks></Blocks>
            </>
        );
    }
}

export default App;
