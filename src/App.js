import React, { Component } from 'react';
import Web3 from 'web3'
import logo from './logo.svg';
import './App.css';
import getWeb3 from './getWeb3'
import ABI from './test.abi'
const CONTRACT_ADDRESS = '0xa0af7b9d6d04a270662f78d31daccbef71db5123'
class App extends Component {
  state = {
    web3Loaded: false
  }
  constructor(props){
    super(props)
    this.onClickOne = this.onClickOne.bind(this)
    this.onClickTwo = this.onClickTwo.bind(this)
    this.onClickThree = this.onClickThree.bind(this)
    this.onClickBatch = this.onClickBatch.bind(this)
  }
  onClickOne(e){
    e.preventDefault()
    let web3 = new Web3(this.state.web3Config.web3Instance.currentProvider)
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    contract.methods.increaseByOne()
    .send({from: this.state.web3Config.defaultAccount})
    .on('receipt', (receipt) => {
      console.log(receipt)
      window.alert(`Mined at ${JSON.stringify(receipt.blockNumber)} ${receipt.transactionHash}`)
    })
    .on('error', (error) => {
      console.error(error)
      window.alert(JSON.stringify(error))
    })

  }
  async onClickTwo(e){
    e.preventDefault()
    let web3 = new Web3(this.state.web3Config.web3Instance.currentProvider)
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    const data = contract.methods.increaseByOne()
    .encodeABI({from: this.state.web3Config.defaultAccount})
    const gas = await contract.methods.increaseByOne()
    .estimateGas({from: this.state.web3Config.defaultAccount})
    console.log('gas', gas)
    web3.eth.sendTransaction({
      from: this.state.web3Config.defaultAccount,
      data,
      to: CONTRACT_ADDRESS,
      gas: web3.utils.toHex(gas),
      gasPrice: web3.utils.toHex(web3.utils.toWei('1', 'gwei'))
    }).then((tx) => {
      console.log(tx)
      window.alert(tx.blockNumber, tx.transactionHash)
    }).catch((error) => {
      console.error(error)
      window.alert(JSON.stringify(error))
    })
  }
  async onClickThree(e){
    e.preventDefault()
    window.web3.eth.sendTransaction({
      from: this.state.web3Config.defaultAccount,
      data: '0x974ba1e2',
      gas: '100000',
      to: CONTRACT_ADDRESS
    }, (err, res) => {
      console.log(err, res)
      this.getTx(res)
    })
  }
  getTx(hash) {
    window.web3.eth.getTransaction(hash, (err, res) => {
      console.log(res)
      if(res.blockNumber === null){
        setTimeout(() => {
          this.getTx(hash)
        }, 500)
      } else {
        window.alert(res.blockNumber)
      }
    })
  }
  async onClickBatch(e) {
    e.preventDefault()
    const cb = (e) => {
      console.log(e,arguments, 'ZPIDA')
    }
    let web3 = new Web3(this.state.web3Config.web3Instance.currentProvider)
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    const data = contract.methods.increaseByOne()
    .encodeABI({from: this.state.web3Config.defaultAccount})
    const gas = await contract.methods.increaseByOne()
    .estimateGas({from: this.state.web3Config.defaultAccount})
    console.log('gas', gas)
    var batch = new web3.BatchRequest();

    const tx1 = web3.eth.sendTransaction.request({
      from: this.state.web3Config.defaultAccount,
      data,
      to: CONTRACT_ADDRESS,
      gas: web3.utils.toHex(gas),
      gasPrice: web3.utils.toHex(web3.utils.toWei('1.01', 'gwei'))
    })
    const tx2 = web3.eth.sendTransaction.request({
      from: this.state.web3Config.defaultAccount,
      data,
      to: CONTRACT_ADDRESS,
      gas: web3.utils.toHex(gas),
      gasPrice: web3.utils.toHex(web3.utils.toWei('2.02', 'gwei'))
    }, cb)
    const tx3 = web3.eth.sendTransaction.request({
      from: this.state.web3Config.defaultAccount,
      data,
      to: CONTRACT_ADDRESS,
      gas: web3.utils.toHex(gas),
      gasPrice: web3.utils.toHex(web3.utils.toWei('3.03', 'gwei'))
    }, cb)
    batch.add(tx2);
    batch.add(tx3);
    batch.add(tx1);
    batch.execute()

  }
  componentDidMount(){
    getWeb3().then((web3Config) => {
      console.log(web3Config)
      
      this.setState({
        web3Loaded: true,
        web3Config
      })
    })
  }
  render() {
    console.log(this.state)
    console.log('hello world!')
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.onClickOne} disabled={!this.state.web3Loaded}>Send TX via method#1(like in Voting Dapp)</button> <br/>
        <button onClick={this.onClickTwo} disabled={!this.state.web3Loaded}>Send TX via method#2</button>
        <button onClick={this.onClickThree} disabled={!this.state.web3Loaded}>Send TX via method#3</button>
        <button onClick={this.onClickBatch} disabled={!this.state.web3Loaded}>Test Batch send via web3.createBatch</button>
      </div>
    );
  }
}

export default App;
