import React, { useEffect, useState } from 'react';
import './assets/css/cc.css';
import axios from 'axios';

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [currencyNames, setCurrencyNames] = useState({});
// console.log(fromCurrency);
// console.log(toCurrency);
//console.log(currencyNames);//it fetch currency code and country like INR-Indian Rupee
//console.log(currencyOptions);// it fetch all currency code  only like INR,USD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const currencies = Object.keys(res.data.rates);
        setCurrencyOptions(currencies);
        setFromCurrency('INR');
        setToCurrency(currencies[0]);

        const currencyNamesRes = await axios.get('https://openexchangerates.org/api/currencies.json');
        setCurrencyNames(currencyNamesRes.data);
        
      } catch (error) {
        console.error('Error fetching currency data', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        let url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
        const res = await axios.get(url);
        setExchangeRate(res.data.rates[toCurrency]);
      } catch (error) {
        console.error('Error fetching exchange rate', error);
      }
    };

    getExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedAmount((amount * exchangeRate).toFixed(2));
    }
  }, [amount, exchangeRate]);

  const handleChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  const handleFromCurrency = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrency = (e) => {
    setToCurrency(e.target.value);
  };

  const getCurrencyName = (currencyCode) => {
    return `${currencyCode} - ${currencyNames[currencyCode] || currencyCode}`;
  };

  return (
    <div className="currency-converter">
      <div className="box"></div>
      <div className="data">
        <h2>Currency Converter</h2>
        <div className="input-container">
          <label htmlFor="amt">Amount</label>
          <input type="number" id="amt" value={amount} onChange={handleChange} min='1' />
        </div>
        <div className="input-container">
          <label htmlFor="fromCurrency">From Currency</label>
          <select id="fromCurrency" value={fromCurrency} onChange={handleFromCurrency}>
            <option value="">-- Select Currency --</option>
            {currencyOptions.map(currency => (
              <option key={currency} value={currency}>{getCurrencyName(currency)}</option>
            ))}
          </select>
        </div>
        <div className="input-container">
          <label htmlFor="toCurrency">To Currency</label>
          <select id="toCurrency" value={toCurrency} onChange={handleToCurrency}>
            <option value="">-- Select Currency --</option>
            {currencyOptions.map(currency => (
              <option key={currency} value={currency}>{getCurrencyName(currency)}</option>
            ))}
          </select>
        </div>
        <div className="result">
          <p>
            {amount} {fromCurrency} is equal to {convertedAmount} {toCurrency}
          </p>
        </div>
      </div>
    </div>
  );
};
