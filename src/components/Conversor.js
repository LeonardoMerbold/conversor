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
        }
    }

    async season(graph) {

        try {
            let dateEnd = DateTime.now().setZone("system");
            let dateStart = 0, dateAmount = 0, graphColor1 = '', graphColor2 = '', a = 0, b = 0;

            switch(graph){
                case '1H':
                    dateStart = dateEnd.minus({ days: 1 });
                    dateAmount  = 55;
                    dateStart = dateStart.toFormat('yyyyMMdd');
                    dateEnd = dateEnd.toFormat('yyyyMMdd');
                    graphColor1 = 'rgb(255,255,255)';
                    graphColor2 = 'rgba(240,240,240,0.2)';
                    break;
                case '1D':
                    dateStart = dateEnd.minus({ days: 1 });
                    dateAmount  = 90;
                    dateStart = dateStart.toFormat('yyyyMMdd');
                    dateEnd = dateEnd.toFormat('yyyyMMdd');
                    graphColor1 = 'rgb(160,194,0)';
                    graphColor2 = 'rgba(160,194,0,0.2)';
                    break;
                case '3D':
                    dateStart = dateEnd.minus({ days: 3 });
                    dateAmount = 90;
                    dateStart = dateStart.toFormat('yyyyMMdd');
                    dateEnd = dateEnd.toFormat('yyyyMMdd');
                    graphColor1 = 'rgb(213,187,250)';
                    graphColor2 = 'rgba(213,187,250,0.2)';
                    break;
                case '7D':
                    dateStart = dateEnd.minus({ days: 7 });
                    dateAmount = 90;
                    dateStart = dateStart.toFormat('yyyyMMdd');
                    dateEnd = dateEnd.toFormat('yyyyMMdd');
                    graphColor1 = 'rgb(245,164,51)';
                    graphColor2 = 'rgba(245,164,51,0.2)';
                    break;
                case '15D':
                    dateStart = dateEnd.minus({ days: 15 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;
                    graphColor1 = 'rgb(247,60,41)';
                    graphColor2 = 'rgb(247,60,41,0.2)';
                    break;
                case '1M':
                    dateStart = dateEnd.minus({ month: 1 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;
                    graphColor1 = 'rgb(95,255,76)';
                    graphColor2 = 'rgba(95,255,76,0.2)';
                    break;
                case '3M':
                    dateStart = dateEnd.minus({ month: 3 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;
                    graphColor1 = 'rgb(41,186,227)';
                    graphColor2 = 'rgb(41,186,227,0.2)';
                    break;
                case '6M':
                    dateStart = dateEnd.minus({ month: 6 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;
                    graphColor1 = 'rgb(210,194,45)';
                    graphColor2 = 'rgb(210,194,45,0.2)';
                    break;
                case '1A':
                    dateStart = dateEnd.minus({ year: 1 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;
                    graphColor1 = 'rgb(247,126,126)';
                    graphColor2 = 'rgba(247,126,126,0.2)';
                    break;
                case '5A':
                    dateStart = dateEnd.minus({ year: 5 });
                    dateAmount = dateEnd.diff(dateStart, 'days').values.days;
                    a = dateEnd;
                    b = dateEnd.minus({ days: 1 });
                    dateStart = dateStart.toFormat('yyyyMMdd');
                    dateEnd = dateEnd.toFormat('yyyyMMdd');
                    break;
                default:
                    console.log('Use os valores válidos!');
            }

            let resData;

            if(graph === '1H' || graph === '1D' || graph === '3D' || graph === '7D'){
                fetch(`https://economia.awesomeapi.com.br/USD-BRL/${dateAmount}?start_date=${dateStart}&end_date=${dateEnd}`)
                    .then( (e) => e.json()
                            .then( data => {
                                ( graph === '1H' ? resData = ( data.map((e) => e.bid )) : resData = ( data.map((e) => e.high )))
                                const APIGraph = {
                                    labels: data.reverse().map((e) => DateTime.fromSeconds(Number(e.timestamp)).toFormat('ccc, HH:mm:ss a')),
                                    datasets: [{
                                        label: 'Em teste...',
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

            }else if( graph === '5A' ){
                let result = [];
                let promises = [];

                for( let i = 1 ; i <= 100 ; i++){
                    promises.push(fetch(`https://economia.awesomeapi.com.br/USD-BRL/1?start_date=${dateStart}&end_date=${dateEnd}`))
                    console.log(promises)

                    dateEnd = a.minus({ days: i });
                    dateStart = b.minus({ days: i });
                    dateStart = dateStart.toFormat('yyyyMMdd');
                    dateEnd = dateEnd.toFormat('yyyyMMdd');
                }

                const data = await Promise.all(promises);
                //console.log('foi:', data)
                data.forEach(({ data }) => {
                        result = [...result, data];
                });

                //console.log('array cheio: ', result);

            }else{
                fetch(`https://economia.awesomeapi.com.br/json/daily/${this.state.coinA_type}-${this.state.coinB_type}/${dateAmount}`)
                    .then( (e) => e.json()
                        .then( data => {
                            resData = ( data.map((e) => e.high ));
                            const APIGraph = {
                                labels: data.reverse().map((e) => DateTime.fromSeconds(Number(e.timestamp)).toFormat('ccc., dd MMM. yyyy')),
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
            }

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

                        <button onClick={() => { this.season('1H') }}>Last Hour</button>

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
