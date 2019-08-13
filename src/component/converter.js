import React from "react";
import axios from "axios";
import converter from "../assets/converter.css";
import TextField from '@material-ui/core/TextField';
// import currency from '../assets/currency.json';

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      fromCurrency: "AUD",
      toCurrency: "USD",
      amount: 1,
      currencies: []
    };
  }
  componentDidMount() {
    axios
      .get('http://api.openrates.io/latest').then(response => {
        const currencyAr = ["EUR"];
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
    if (this.state.fromCurrency !== this.state.toCurrency) {
      axios
        .get(`http://api.openrates.io/latest?base=${this.state.fromCurrency}&symbols=${this.state.toCurrency}`).then(response => {
          const result = this.state.amount * response.data.rates[this.state.toCurrency];
          this.setState({ result: result.toFixed(2) });
        })
        .catch(error => {
          console.log("Opps", error.message);
        });
    } else {
      this.setState({ result: "You cant convert the same currency!" });
    }
  };
  
  selectHandler = event => {
    if (event.target.name === "from") {
      this.setState({ fromCurrency: event.target.value });
    } else {
      if (event.target.name === "to") {
        this.setState({ toCurrency: event.target.value });
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
export default Converter;