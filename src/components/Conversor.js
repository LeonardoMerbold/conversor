import React, { Component } from 'react';
import './Conversor.css';
import { DateTime } from 'luxon';
import { Chart as ChartJS } from 'chart.js/auto';
import {Line} from 'react-chartjs-2';

export default class Conversor extends Component{

    constructor(props) {
        super(props);

        this.state = {
            coinA_value: 0,
            coinB_value: 0,
            coinA_type: "USD",
            coinB_type: "BRL",
            APIGraph: null,
        }

        this.converter = this.converter.bind(this);
        this.season = this.season.bind(this);
    }


    async converter() {
        const from_to = `${this.state.coinA_type}${this.state.coinB_type}`
        const url = `https://economia.awesomeapi.com.br/json/last/${this.state.coinA_type}-${this.state.coinB_type}`

        const quotation = await fetch(url)
            .then((e) => e.json())
            .then((e) => e[from_to].bid);

        if (this.state.coinA_value === "") {
            this.setState({ coinB_value:'' });
        } else {
            const coinB_value = (parseFloat(this.state.coinA_value) * quotation).toFixed(2)
            this.setState({ coinB_value })
            //console.log('Moeda B recebe:', coinB_value)
        }
    }

    swap(){
        let aux, coinA_type, coinB_type;

        aux = this.state.coinB_type;
        coinB_type = this.state.coinA_type;
        coinA_type = aux;
        // let z = event => {
        //     event.target.setAttribute(this.state.coinB_value, this.state.coinA_value);
        // }
        // console.log(this.state.coinB_value)
        
        //console.log('meu swap', coinA_type,  coinB_type, aux)
        this.converter();
        //console.log(this.converter()) // promessa pendente

        this.setState ({ coinA_type, coinB_type });
    }

    async season(graph) {

        try {
            let dateEnd = DateTime.now().setZone("system");
            let dateStart = 0, dateAmount = 0, graphColor1 = '', graphColor2 = '', a = 0, b = 0, url = '', resData = [], newData = [],average = 0, total= 0.0;

            switch(graph){
                case '1H':
                    dateStart = dateEnd.minus({ days: 1 });
                    dateAmount  = 54;
                    dateStart = dateStart.toFormat('yyyyMMdd');
                    dateEnd = dateEnd.toFormat('yyyyMMdd');
                    graphColor1 = 'rgb(255,255,255)';
                    graphColor2 = 'rgba(240,240,240,0.2)';
                    break;
                case '15D':
                    dateStart = dateEnd.minus({ days: 15 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;
                    break;
                case '1M':
                    dateStart = dateEnd.minus({ month: 1 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;
                    break;
                case '3M':
                    dateStart = dateEnd.minus({ month: 3 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;
                    break;
                case '6M':
                    dateStart = dateEnd.minus({ month: 6 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;
                    break;
                case '1A':
                    dateStart = dateEnd.minus({ year: 1 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;
                    break;
                case '5A':
                    dateStart = dateEnd.minus({ year: 5 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;

                    dateStart = dateEnd.minus({ days: 1 })
                    a = dateEnd;
                    b = dateEnd.minus({ days: 1 });
                    dateStart = dateStart.toFormat('yyyyMMdd');
                    dateEnd = dateEnd.toFormat('yyyyMMdd');
                    break;
                default:
                    console.log('Use os valores válidos!');
            }

            (graph === '1H' ? url = `https://economia.awesomeapi.com.br/${this.state.coinA_type}-${this.state.coinB_type}/${dateAmount}?start_date=${dateStart}&end_date=${dateEnd}` : url = `https://economia.awesomeapi.com.br/json/daily/${this.state.coinA_type}-${this.state.coinB_type}/${dateAmount}`)

            fetch(url)
                .then( (e) => e.json()
                    .then( data => {
                        if(graph === '1H'){
                            resData = ( data.map((e) => e.bid ))
                            newData = data.reverse().map((e) => DateTime.fromSeconds(Number(e.timestamp)).toFormat('ccc, HH:mm:ss a'))
                        }else{
                            resData = ( data.map((e) => e.high ));
                            newData.push(data[0]);

                            for(let i = 0 ; i < data.length-1 ; i++){
                                (data[i].timestamp - data[i+1].timestamp > 1000 ? newData.push(data[i+1]) : console.log());//i+1, 'é referente ao mesmo dia. a duplicata será removida do array!!'));
                            }
                            //console.log(data)
                            //console.log(newData)

                            for(let i = 0 ; i < newData.length ; i++){
                                total += Number(newData[i].high);
                            }
                            average = (total/newData.length).toFixed(3)
                            //console.log(newData[newData.length-1].high)

                            if(newData[newData.length-1].high > average){
                                console.log('Média:', average, ' >>>>> Ultimo:', newData[0].high)
                                graphColor1 = 'rgb(95,255,76)';
                                graphColor2 = 'rgba(95,255,76,0.2)';
                            }else{
                                console.log('Média:', average, ' <<<<< Ultimo:', newData[0].high)
                                graphColor1 = 'rgb(247,126,126)';
                                graphColor2 = 'rgba(247,126,126,0.2)';
                            }

                            resData = ( newData.map((e) => e.high ));
                            resData = resData.map(str => {
                                return parseFloat(str).toFixed(3)
                                // if(resData[1] < 1){
                                //     return Number(str).toFixed(3);
                                // }else{
                                //     return Number(str).toFixed(2);
                                // }

                            })
                            newData = newData.reverse().map((e) => DateTime.fromSeconds(Number(e.timestamp)).toFormat('ccc., dd MMM. yyyy'))
                        }

                        const APIGraph = {
                            labels: newData,
                            datasets: [{
                                label: 'Conversão',
                                fill: true,
                                lineTension: 0,
                                backgroundColor: graphColor2,
                                borderColor: graphColor1,
                                hoverBackgroundColor: 'rgb(0,0,0)',
                                borderWidth: 2,
                                data: resData.reverse()
                            }]
                        }
                        this.setState({APIGraph});
                    })
                )
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        const options = this.props.options;
        const listOfSiglas = Object.keys(options);

        return (
            <div id="application">

                <div id="currency:1">
                    <input
                        value={this.state.coinA_value}
                        type="number"
                        min="0"
                        onInput={
                            (event) => {
                                let valorInput = event.target.value;
                                this.setState({ coinA_value: valorInput });
                                //console.log( this.state.coinA_value );
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

                <div>
                    <button onClick={() => { this.swap() }}>Trocar</button>
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

                        <button onClick={() => { this.season('1H') }}>Last Hour</button>

                        <button onClick={() => { this.season('15D') }}>15D</button>

                        <button onClick={() => { this.season('1M') }}>1M</button>

                        <button onClick={() => { this.season('3M') }}>3M</button>

                        <button onClick={() => { this.season('6M') }}>6M</button>

                        <button onClick={() => { this.season('1A') }}>1A</button>

                    </div>

                </div>

                <div>
                    { this.state.APIGraph !== null ? (
                        <Line
                        data={this.state.APIGraph}
                        // options={{
                        //     title:{
                        //         display:false,
                        //         text:'Average Rainfall per month',
                        //         fontSize:20,
                        //     },
                        //     legend:{
                        //         display:true,
                        //         position:'right'
                        //     }
                        // }}
                    />)
                    : <h4> Aguardando Gráfico... </h4>}
                </div>
            </div>
        )
    }
}
