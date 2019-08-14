import React from "react";
import axios from "axios";
import converter from "../assets/converter.css";
import TextField from '@material-ui/core/TextField';

let dx;

var crossMatrix = [["1:1","USD","USD","USD","USD","USD","USD","USD","USD","USD","D"],
["USD","1:1","USD","USD","USD","USD","USD","USD","USD","USD","D"],
["USD","USD","1:1","USD","USD","USD","USD","USD","USD","USD","D"],
["USD","USD","USD","1:1","EUR","Inv","USD","USD","EUR","USD","EUR"],
["USD","USD","USD","EUR","1:1","Inv","USD","USD","EUR","USD","EUR"],
["USD","USD","USD","D","D","1:1","USD","USD","D","USD","D"],
["USD","USD","USD","USD","USD","USD","1:1","USD","USD","USD","D"],
["USD","USD","USD","USD","USD","USD","USD","1:1","USD","USD","Inv"],
["USD","USD","USD","EUR","EUR","Inv","USD","USD","1:1","USD","EUR"],
["USD","USD","USD","USD","USD","USD","USD","USD","USD","1:1","D"],
["Inv","Inv","Inv","EUR","EUR","Inv","Inv","D","EUR","Inv","1:1"]]


class Currency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      fromCurrency: "AUD",
      toCurrency: "USD",
      amount: 1,
      mIndex: "0",
      nIndex: "10",
      indexValue: "0",
      rateString: "AUDUSD",
      currencies: []
    };
  }

  componentWillMount() {
      axios
      .get('currency.json').then(response => {
        const currencyAr = [];
        for (const key in response.data.rates) {
          currencyAr.push(key);
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        this.setState({ currencies: currencyAr });
      })
      
      .catch(err => {
        console.log("oppps", err);
      });      
      
  }

  convertHandler = () => {

    var m = this.state.mIndex;
    var n = this.state.nIndex;

      var str = this.state.fromCurrency.concat(this.state.toCurrency);
      this.setState({ rateString: str });
      
        var matrixValue = crossMatrix[m][n];
        axios
          .get('rate.json').then(response => {
        if(matrixValue === "1:1"){
          this.promptHnadler();
        } 
        else if(matrixValue === "D"){
          this.directHandler();
        }
        else if(matrixValue === "Inv"){
          this.inverseHandler();
        }
        else{
          this.ccyHandler();
          }
        })
        .catch(err => {
          console.log("oppps", err);
        });
    };

  promptHnadler = () => {
    this.setState({result: "You cant convert the same currency!"})    
  }

  directHandler = () => {
    var concateString = this.state.fromCurrency + this.state.toCurrency;
      this.setState({ rateString: concateString });
      axios
      .get('rate.json').then(response => {
        for (const key in response.data.rates) {
          if(this.state.rateString === key){
            var fd = this.state.amount * response.data.rates[key]
            this.setState({ result: fd});
          }
        }
      })      
      .catch(err => {
        console.log("oppps", err);
      });
  }

  inverseHandler = () => {
    var str = this.state.fromCurrency.concat(this.state.toCurrency);
      var inversString = this.state.toCurrency.concat(this.state.fromCurrency);
      this.setState({ rateString: str });
      axios
      .get('rate.json').then(response => {
        var sk = (1 / response.data.rates[inversString]) * this.state.amount ;
        this.setState({ result: sk.toFixed(2)});
      })
      .catch(err => {
        console.log("oppps", err);
      });
  }

  ccyHandler = () => {

    var i = this.state.mIndex;
    var j = this.state.nIndex;

    var matrixValue = crossMatrix[i][j];
    axios
      .get('currency.json').then(response => {
        for (const key in response.data.rates) {
          this.setState({vIndex: response.data.rates[matrixValue]})
        }
      })
      
      .catch(err => {
        console.log("oppps", err);
      });      
    axios
      .get('rate.json').then(response => {
    var ccyString1 = this.state.fromCurrency.concat(matrixValue);
    var ccyString2 = matrixValue.concat(this.state.toCurrency);
    for (const key in response.data.rates) {
      if(ccyString1 === key && ccyString2 === key ){
      this.dx = (this.state.amount) * (response.data.rates[ccyString1]) * (response.data.rates[ccyString2]) ;
      this.setState({ result: this.dx});
      // break;
      }
      else if(ccyString1 !== key || ccyString2 !== key ){
        if( ccyString1 !== key && ccyString2 === key){
          var ccyString11 = matrixValue.concat(this.state.fromCurrency);
          var ccyResult = this.state.amount * response.data.rates[ccyString11] * response.data.rates[ccyString2] ;
          this.setState({ result: ccyResult});
          break;
        }

        if(ccyString1 === key && ccyString2 !== key){
          var ccyString11 = this.state.fromCurrency.concat(matrixValue);
          var ccyString12 = this.state.toCurrency.concat(matrixValue);
          var ccyResult = this.state.amount * response.data.rates[ccyString11] * response.data.rates[ccyString12] ;
          this.setState({ result: ccyResult});
          // break;
          
        }
        if(ccyString12 !== key  ){
          var v = this.state.vIndex;
          console.log("skdjsjdkasdjsadas: ", v);
          var matrixValue1 = crossMatrix[v][j];
          var ccyStringa = matrixValue.concat(matrixValue1);
          var ccyStringb = matrixValue1.concat(this.state.toCurrency);
          if(ccyStringa !== key || ccyStringb === key){
            var ccyStringaa = matrixValue1.concat(matrixValue);
            var ccyResulta = this.state.amount * response.data.rates[ccyStringaa] * response.data.rates[ccyStringb] ;
            this.setState({ result: ccyResulta});
          }
          // break;
        }
        if(ccyString1 !== key && ccyString2 === key){
          var ccyString21 = matrixValue.concat(this.state.fromCurrency);
          var ccyString22 = matrixValue.concat(this.state.toCurrency);
          var ccyResult1 = this.state.amount * response.data.rates[ccyString21] * response.data.rates[ccyString22] ;
          this.setState({ result: ccyResult1});
        }
      }
    }
  })
  .catch(err => {
    console.log("oppps", err);
  });
  }

  // resultHandler = (resultant) =>{
  //   // console.log("came inside result function: ", resultant);
  //   this.setState({result: Number(resultant) });
  // }
  
  selectHandler = event => {

    if (event.target.name === "from") {
      this.setState({ fromCurrency: event.target.value});
      this.setState({ mIndex: event.target.options.selectedIndex });
    } else {
      if (event.target.name === "to") {
        this.setState({ toCurrency: event.target.value });
        this.setState({ nIndex: event.target.options.selectedIndex });
      }
    }
  };

  render() {

    return (
      <div className="Converter">
      
        <h2>
          <span>Currency</span>Converter
        </h2>
        <div className="From" >

          <TextField
            name="amount"
            value={this.state.amount}
            onChange={event => this.setState({ amount: event.target.value })}
            label="Amount"
            margin="dense"
            variant="outlined"
          />

          <select
            name="from"
            onChange={event => this.selectHandler(event)}
            value={this.state.fromCurrency}
          >
            {this.state.currencies.map(cur => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
          <button onClick={this.convertHandler}>Convert</button>
           <br/>

          <TextField
            disabled = {true}
            value={this.state.result}
            margin="dense"
            variant="outlined"
            style = {{marginLeft: '-6%'}}
          />

          <select
            name="to"
            onChange={event => this.selectHandler(event)}
            value={this.state.toCurrency}
          >
            {this.state.currencies.map(cur => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
          
        </div>
      </div>
    );
  }
}
export default Currency;