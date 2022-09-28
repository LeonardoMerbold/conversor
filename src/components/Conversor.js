import React, { Component } from 'react';
import { DateTime } from 'luxon';
import './Conversor.css';

export default class Conversor extends Component{

    constructor(props) {
        super(props);

        this.state = {
            coinA_value: 0,
            coinB_value: 0,
            coinA_type: "USD",
            coinB_type: "BRL",
            //graph: "",
        }

        this.converter = this.converter.bind(this);
        this.season = this.season.bind(this);
    }

    converter() {
        const from_to = `${this.state.coinA_type}${this.state.coinB_type}`
        const url = `https://economia.awesomeapi.com.br/json/last/${this.state.coinA_type}-${this.state.coinB_type}`

        fetch(url)
        .then(res=>{
            return res.json()
        }).then(json=>{
            const quotation = json[from_to].bid;

            // if (this.state.coinA_value === "") {
            //     this.setState({ coinB_value:'' });
            // } else {
            const coinB_value = (parseFloat(this.state.coinA_value) * quotation).toFixed(2)
            this.setState({ coinB_value })
            // }
        })
    }

    season(graph) {
        let dateEnd = DateTime.now().setZone("system");
        let dateStart = 0, dateAmount = 0, diff = 0;
        //console.log(this.state.graph);
        //console.log(this.dateEnd);

        switch(graph){
            case '1D':
                dateStart = dateEnd.minus({ days: 1 }).toFormat('yyyyMMdd');
                dateAmount  = 24;
                break;
            case '3D':
                dateStart = dateEnd.minus({ days: 3 }).toFormat('yyyyMMdd');
                dateAmount = 48
                break;
            case '7D':
                dateStart = dateEnd.minus({ days: 7 }).toFormat('yyyyMMdd');
                dateAmount = 39;
                break;
            case '15D':
                dateStart = dateEnd.minus({ days: 15 }).toFormat('yyyyMMdd');
                dateAmount = 30;
                break;
            case '1M':
                dateStart = dateEnd.minus({ month: 1 });
                diff = dateEnd.diff(dateStart, 'days');
                dateAmount = diff.values.days;
                dateStart = dateStart.toFormat('yyyyMMdd');
                dateEnd = dateEnd.toFormat('yyyyMMdd');
                 break;
            case '3M':
                dateStart = dateEnd.minus({ month: 3 });
                diff = dateEnd.diff(dateStart, 'days');
                dateAmount = diff.values.days;
                dateStart = dateStart.toFormat('yyyyMMdd');
                dateEnd = dateEnd.toFormat('yyyyMMdd');
                break;
             case '6M':
                dateStart = dateEnd.minus({ month: 6 });
                diff = dateEnd.diff(dateStart, 'days');
                dateAmount = diff.values.days;
                dateStart = dateStart.toFormat('yyyyMMdd');
                dateEnd = dateEnd.toFormat('yyyyMMdd');
                break;
            case '1A':
                dateStart = dateEnd.minus({ year: 1 });
                diff = dateEnd.diff(dateStart, 'days');
                dateAmount = diff.values.days;
                dateStart = dateStart.toFormat('yyyyMMdd');
                dateEnd = dateEnd.toFormat('yyyyMMdd');
                break;
            case '5A':
                dateStart = dateEnd.minus({ year: 5 });
                diff = dateEnd.diff(dateStart, 'days');
                dateAmount = diff.values.days;
                dateStart = dateStart.toFormat('yyyyMMdd');
                dateEnd = dateEnd.toFormat('yyyyMMdd');
                break;
            case 'Max':
                console.log("Máximo");
                break;
            default:
                console.log('default');
        }

        const dateUrl = `https://economia.awesomeapi.com.br/USD-BRL/${dateAmount}?start_date=${dateStart}&end_date=${dateEnd}`

        fetch(dateUrl)
        .then(res=>{
            return res.json()
        }).then(json=>{
            //const high = json[dateUrl].high;
        })
        console.log(dateUrl);
    }

    /* Planejar: Como colocar no grafico

    1. Identificar como os valores trabalham dentro da API
        a. Qual o formato da data?
            R: Formato americano/ingles (YYYYMMDD).
        b. Esses dados vem em formato de array? Ou objeto? Será que precisa usar ObjectKeys?
            R: Vem todos em array, definidos pela quantia desejada.
        c. Como criar um Array contendo: O valor da alta.

    2. Recebendo dados da API.
        a. Criar estados para armazenar os dados.
        b. Criar a função para receber os dados (formatar os dados para aplicar no gráfico).
        c. Criar a logica de aplicar o item 'b' no item 'a'.

    3. Criando Chart
        a. Instalando o Chart.js
        b. Criar um modelo de exemplo, sem usar os dados da API.
        c. Modificar o exemplo para que inicie no mesmo dia do Start-Date da API.
        d. Modificar o exemplo para que use os dados da API.

    4. Criar a logica de botão para trocar o Start-Date


    */

    render() {
        const options = this.props.options;
        const listOfSiglas = Object.keys(options);

        //console.log(listOfSiglas);
        return (
            <div id="application">

                <div id="currency:1">
                    <input
                        value={this.state.coinA_value}
                        type="number"
                        min="0"
                        // onKeyUp={this.converter}
                        onInput={
                            (event) => {
                                let valorInput = event.target.value;
                                //valorInput = valorInput.replace(/^[a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, '');
                                this.setState({ coinA_value: valorInput});
                                this.converter();
                            }
                        }
                    />

                    <select value={this.state.coinA_type} onChange={(event) => {this.setState({ coinA_type: event.target.value })}} id="converter">
                        {listOfSiglas.map((key) => {
                            return (<option value={key} key={key+"converter"}>{options[key]}</option>)
                        })}
                    </select>
                </div>


                <div id="currency:2">

                    <input disabled value={this.state.coinB_value}></input>
                    <select value={this.state.coinB_type} onChange={(event) => {this.setState({ coinB_type: event.target.value })}} id="converted">
                        {listOfSiglas.map((key) => {
                            return (<option value={key} key={key+"converted"}>{options[key]}</option>)
                        })}
                    </select>
                </div>

    {/* GRAFICO */}

                <div id="graph-app">

                    <div id="graph-buttons">

                        <button onClick={() => { this.season('1D') }}>1D</button>

                        <button onClick={() => { this.season('3D') }}>3D</button>

                        <button onClick={() => { this.season('7D') }}>7D</button>

                        <button onClick={() => { this.season('15D') }}>15D</button>

                        <button onClick={() => { this.season('1M') }}>1M</button>

                        <button onClick={() => { this.season('3M') }}>3M</button>

                        <button onClick={() => { this.season('6M') }}>6M</button>

                        <button onClick={() => { this.season('1A') }}>1A</button>

                        <button onClick={() => { this.season('5A') }}>5A</button>

                    </div>


                    <div id="graph">

                    </div>
                </div>

            </div>
        )
    }
}
