import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import {ELECTION_ADDRESS,ELECTION_ABI} from './config';
import ReactDOM from 'react-dom';


class App extends Component{
  

  componentWillMount(){
    console.log("DSN: In the mout funcation")
    //this.loadBlockChainData()
    this.connectToGanache()
  }
  
  async loadBlockChainData(){
        console.log("DSN: In the load funcation")
            // Modern dapp browsers...
        if (window.ethereum) {
          console.log(" DSN: in the morden browser")
          App.web3Provider = window.ethereum;
          try {
            // Request account access
            await window.ethereum.enable();
          } catch (error) {
            // User denied account access...
            console.error("User denied account access")
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          console.log("DSN: In the legacy brower")
          App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
          console.log("DSN: In the else part of local hose")
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        const web3 = new Web3(App.web3Provider);
      
    

        //var accounts = []
        var accounts = await web3.eth.getAccounts()
        console.log("dsn account ", accounts[0], accounts.length)
        this.setState({account:accounts[0]})
        this.myelection = new web3.eth.Contract(ELECTION_ABI, ELECTION_ADDRESS)
        console.log("dsn:election", this.myelection)
        console.log("dsn Account details", accounts[0])
        console.log( "in the reg fun", this.myelection.methods.RegCandidate("222", "vSethilnathan D").send({value:2, from:accounts[0]}))
        //console.log( "in the reg fun", this.myelection.methods.RegCandidate("bbb", "vote for bbb").call({value:2, from : accounts[0]}))
        console.log(this.myelection.methods.ListCandidate(2).call())

  }

   

  constructor(props){
    console.log("DSN: In the constructur")
    super(props)
    this.web3 = ""
    this.myelection = ""
    this.contractOwner = "Senthilnathan Duraivelu"
    this.accounts=""
    this.state = {account:"",
    ContractOwner:"DDDD"}
  }

  async connectToGanache(){
    console.log("In the Ganasche connection direct")
    //const web31 = new Web3("http://localhost:7545");
    const web3 = new Web3(window.ethereum)
    await window.ethereum.enable();
    this.accounts = await web3.eth.getAccounts()
    console.log("list of account", this.accounts)
    this.myelection = new web3.eth.Contract(ELECTION_ABI, ELECTION_ADDRESS)
    console.log("dsn:election", this.myelection)
    this.setState({account:this.accounts[0]})
    console.log(this.myelection.methods.ListCandidate(2).call())
  }

  async DoRegistration() {
    console.log(this.accounts[0])
    await this.myelection.methods.RegCandidate("Abin", "Abins promise").send({value:2, from:this.accounts[0]})
    console.log("DDDD", this.contractOwner)
    //this.contractOwner = contractOwner
    //this.contractOwner = "Senthilnathan Duraivelu"
    ReactDOM.render(this.contractOwner, document.getElementById("dsnbutton"))
  
  }

  async GetContractOwner() {
    this.contractOwner= await this.myelection.methods.owner.call()
    console.log("OWNER:", this.contractOwner)
  }

  async ListCandidate(){
    console.log(this.myelection.methods.ListCandidate(1).call())
  }

  render(){
    console.log("IIIII am called first")
    return(
      <div className="container">
        <h1> Hello world!</h1>
        <p>FirstAccount : {this.state.account}</p>
        <button id="dsnbutton1" onClick={()=>this.GetContractOwner()}>GetOwner</button>
        <button id="dsnbutton2" onClick={()=>this.DoRegistration()}>Register</button>
        <button id="dsnbutton3" onClick={()=>this.ListCandidate()}>ListCandidate</button>
        <p> ContractOwner:{this.contractOwner}</p>
        <h1 id="root"></h1>
      </div>
    );
  }
}

export default App;
