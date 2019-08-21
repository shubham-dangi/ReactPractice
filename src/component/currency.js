import React from "react";
import axios from "axios";
import converter from "../assets/converter.css";
import TextField from '@material-ui/core/TextField';

let dx;

let rate1,rate2;

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
      vIndex: "0",
      rateString: "AUDUSD",
      matrixValue: "D",
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
        this.setState({matrixValue: matrixValue});
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
    
    var r1,r2,r3,r4;

    axios
      .get('currency.json').then(response => {
        for (const key in response.data.rates) {
          if(this.state.matrixValue === key)
          this.setState({vIndex: response.data.rates[this.state.matrixValue]})
        }
      })      
      .catch(err => {
        console.log("oppps", err);
      });

      var ccyString1 = this.state.fromCurrency.concat(this.state.matrixValue);
      var inverseString1 = this.state.matrixValue.concat(this.state.fromCurrency);
      var ccyString2 = this.state.matrixValue.concat(this.state.toCurrency);
      var inversString2 = this.state.toCurrency.concat(this.state.matrixValue);
      var matrixValue1 = crossMatrix[this.state.mIndex][this.state.vIndex];
              var matrixValue2 = crossMatrix[this.state.vIndex][this.state.nIndex];
              var ccyStringm1 = this.state.fromCurrency.concat(matrixValue1);
              var inverseCcyStringm1 = matrixValue1.concat(this.state.fromCurrency);
              var ccyStringmm1 = matrixValue1.concat(this.state.matrixValue);
              var inverseCcyStringmm1 = this.state.matrixValue.concat(matrixValue1);
              var ccyStringm2 = this.state.matrixValue.concat(matrixValue2);
              var inverseCcyStringm2 = matrixValue2.concat(this.state.matrixValue);
              var ccyStringmm2 = matrixValue2.concat(this.state.toCurrency);
              var inverseCcyStringmm2 = this.state.toCurrency.concat(matrixValue2);

      axios.
        get('rate.json').then(response => {
          for(const key in response.data.rates){
            if(ccyString1 === key){
              rate1 = response.data.rates[ccyString1];
              // break;
            }
            else if(inverseString1 === key){
              rate1 = 1/response.data.rates[inverseString1];
              // break;
            }
            else if(ccyString2 === key){
              rate2 = response.data.rates[ccyString2];
              // break;
            }
            else if(inversString2 === key){
              rate2 = 1/response.data.rates[inversString2];
              // break;
            }
            // if(ccyString1!== key){
              // else if(ccyStringm1 === key){
              //   r1 = response.data.rates[ccyStringm1];
              // }
              // else if(inverseCcyStringm1 === key){
              //   r1 = 1/ response.data.rates[inverseCcyStringm1];
              // }
              // else if(ccyStringmm1 === key){
              //   r2 = response.data.rates[ccyStringmm1];
              // }
              // else if(inverseCcyStringmm1 === key){
              //   r2 = 1 / response.data.rates[inverseCcyStringmm1];
              // }
              // else if(ccyStringm2 === key){
              //   r3 = response.data.rates[ccyStringm2];
              // }
              // else if(inverseCcyStringm2 === key){
              //   r3 = 1 / response.data.rates[inverseCcyStringm2];
              // }
              // else if(ccyStringmm2 === key){
              //   r4 = response.data.rates[ccyStringmm2];
              // }
              // else if(inverseCcyStringmm2 === key){
              //   r4 = 1 / response.data.rates[inverseCcyStringmm2];
              // }

            // }
          }

          // rate1 = r1 * r2;
          // rate2 = r3 * r4;
          
          var sd = this.state.amount * rate1 * rate2;
          console.log("ccyString rate: ", sd);
          this.setState({result : sd});

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