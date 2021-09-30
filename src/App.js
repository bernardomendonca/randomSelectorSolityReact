import "./App.css";
import React from "react";
import web3 from './web3';
import randomSelector from './randomSelector';

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: "",
    value: "",
    message: ""
  };
  
  async componentDidMount(){
    const manager = await randomSelector.methods.manager().call();
    const players = await randomSelector.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(randomSelector.options.address);
    
    this.setState({ manager, players, balance });
  }

  onSubmit = async(event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaciton...' });

    await randomSelector.methods.enter().send({ from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether') })

    this.setState({ message: 'You have been entered' })

  }

  onClick = async() => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting transaction success...' });

    await randomSelector.methods.pickWinner().send({ from: accounts[0] });

    this.setState({ message: 'A winner has been picked!' });

  }

  render() {
    return (
     <div>
       <h2>Solity Contract: Random Selector</h2>
       <p>
         This contract is managed by: {this.state.manager}.
         There are currently {this.state.players.length} people in this draw,
         competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
      </p>
      <hr />
      <form onSubmit ={this.onSubmit}>
        <h4>Join the draw:</h4>
        <div>
          <label>Amount of ether to enter:</label>
          <input 
          value={this.state.value}
          onChange={event => this.setState({ value: event.target.value })} />
        </div>
        <button>
          Enter
        </button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={this.onClick}>Pick a winner!</button>
      
      <hr />

      <h1>{this.state.message}</h1>
     </div>
    );
  }
}
export default App;
