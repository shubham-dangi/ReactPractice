import React from "react";
// import ReactDOM from "react-dom";
import axios from "axios";
import converter from "../assets/converter.css";
import TextField from '@material-ui/core/TextField';
// import currency from '../assets/currency.json';


// var currencyData = {
    
//         "rates": 
//             {
//                 "AUDUSD" : "0.8371",
//                 "CADUSD" : "0.8711",
//                 "USDCNY" : "6.1715"
//             }
    
// }


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
      currencies: [],
      m: 0,
      n: 0
    };
  }

//   componentDidMount () {
//     // this.http.get("assets/currency.json").map(res => res.json());
//     var data = require('../assets/currency.json');
//     for(var i = 0; i < data.length; i++) {
//         var obj = data[i];
//         console.log("Name: " + obj.rates.CAD );
//     }
// }

  componentWillMount() {
    // const ax = axios.create({
    //     baseURL: 'http://localhost:3000/assets'
    //   })
      axios
      .get('currency.json').then(response => {
        const currencyAr = [];
        console.log(response.data.rates);
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
        // this.setState(currentState => ({ fromCurrency: currentState.fromCurrency }), () => {
        //     console.log(this.state.fromCurrency);
        // });
      this.setState({ fromCurrency: event.target.value});
    //   const ms = event.target.options.selectedIndex;
    //   console.log(sd);
    //   this.setstate({ m: ms });
    // console.log(ms);
    //   console.log(this.state.m);
        
    } else {
      if (event.target.name === "to") {
        this.setState({ toCurrency: event.target.value });
        this.setstate({ n: event.target.options.selectedIndex });
      console.log(this.state.n);
      }
    }
    console.log(this.state.fromCurrency);
    console.log(this.state.currencies);
  };

  render() {
//     const currencyList = this.state.currencies;
//     let currencyListBlock = '';
 
//   if(this.currencyList.length > 0) {
//     currencyListBlock = currencyList.map( obj => {
//       return (
//           alert("success")
//         // <Usercard key={obj.id} id={obj.id} imgPath={obj.avatar_url} name={obj.name} />
//  			)
//  	})
//    }

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