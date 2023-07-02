import React, { Component } from 'react';

class App extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch('http://localhost:1234/api/wallet-info').then((res) =>
            console.log(res)
        );
        // .then((json) => console.log(json));
    }
    render() {
        const { address, balance } = this.state.walletInfo;
        return (
            <>
                <div>Welcome to blockchain...</div>
                <div>Address: {address}</div>
                <div>Balance: {balance}</div>
            </>
        );
    }
}

export default App;
