import './Conversor.css';
import React, { useState, useMemo, useEffect } from 'react';
import { DateTime } from 'luxon';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';
import { useCurrency } from "../contexts/Currency";

ChartJS.register(...registerables);

interface CurrencyVariables {
    options: any,
    loading: any,
}

export default function Conversor(){

    const [coinA_value, setCoinA_value] = useState<string>('');
    const [coinB_value, setCoinB_value] = useState<string>('');
    const [coinA_type, setCoinA_type] = useState<string>("USD");
    const [coinB_type, setCoinB_type] = useState<string>("BRL");
    const [graphPeriod, setGraphPeriod] = useState<string>('');
    const [graphMode, setGraphMode] = useState<boolean>(false);
    const [APIGraph, setAPIGraph] = useState<any>(null);
    const [selected, setSelected] = useState<number>(0);

    const {options, loading} = useCurrency() as CurrencyVariables;

    async function Converter(inputValue: string|number) {
        const from_to = `${coinA_type}${coinB_type}`
        const url = `https://economia.awesomeapi.com.br/json/last/${coinA_type}-${coinB_type}`

        const quotation = await fetch(url)
            .then((e) => e.json())
            .then((e) => e[from_to].bid);

        if (inputValue === "") {
            setCoinB_value('');
        } else {
            setCoinB_value(( (parseFloat as any) ((inputValue as number) * quotation).toFixed(2) ))
        }
    }

    async function Swap(){
        let aux;

        if(selected === 0){
            setSelected(1);
        }else{
            setSelected(0);
        }

        aux = coinB_type;
        setCoinB_type(coinA_type);
        setCoinA_type(aux);
    }

    useEffect(() => {
        Converter(coinA_value);

        if(graphMode !== false || graphPeriod !== ''){
            Season(graphPeriod);
        }
    }, [coinA_type, coinB_type, graphPeriod]);


    function Period(buttonValue:string){
        setGraphPeriod(buttonValue);
    }

    function Season(graphPeriod:string) {
        try {
            let dateEnd:any = DateTime.now().setZone("system");
            let dateStart:any, dateAmount: any, graphColor1: string, graphColor2: string, url: string, resData: Array<string>, newData: any, average: string;

            setGraphMode(true);

            switch(graphPeriod){
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
                default:
                    alert('Atenção: Use apenas os valores válidos!');
            }

            (graphPeriod === '1H' ? url = `https://economia.awesomeapi.com.br/${coinA_type}-${coinB_type}/${dateAmount}?start_date=${dateStart}&end_date=${dateEnd}` : url = `https://economia.awesomeapi.com.br/json/daily/${coinA_type}-${coinB_type}/${dateAmount}`)

            fetch(url)
                .then( (e) => e.json()
                    .then( data => {
                        if(graphPeriod === '1H'){
                            resData = ( data.map((e:any) => e.bid ))
                            newData = data.reverse().map((e:any) => DateTime.fromSeconds(Number(e.timestamp)).toFormat('ccc, HH:mm:ss a'))
                        }else{
                            resData = data.map((e:any) => e.high );
                            newData = [newData, data[0]]; //return undefined value

                            for(let i = 0 ; i < data.length-1 ; i++){
                                if(data[i].timestamp - data[i+1].timestamp > 1000){
                                    newData = [...newData, data[i+1]];
                                }
                            }
                            newData = newData.filter(Boolean); //remove undefined value

                            const total = newData.reduce( (prev:number, curr:any) => prev + Number(curr.high), 0)

                            average = (total/newData.length).toFixed(4)

                            if(newData[newData.length-1].high > average){
                                graphColor1 = 'rgb(95,255,76)';
                                graphColor2 = 'rgba(95,255,76,0.2)';
                            }else{
                                graphColor1 = 'rgb(247,126,126)';
                                graphColor2 = 'rgba(247,126,126,0.2)';
                            }

                            resData = ( newData.map((e:any) => e.high ));
                            resData = resData.map(str => {
                                if(resData[0] < '1'){
                                    return Number(str).toFixed(4);
                                }else{
                                    return Number(str).toFixed(2);
                                }
                            })
                            newData = newData.reverse().map((e:any) => DateTime.fromSeconds(Number(e.timestamp)).toFormat('ccc., dd MMM. yyyy'))
                        }

                        const APIGraph = {
                            labels: newData,
                            datasets: [{
                                label: 'Conversão',
                                fill: true,
                                lineTension: 0,
                                cubicInterpolationMode: 'monotone',
                                pointHitRadius: 5,
                                pointHoverBorderWidth: 4.5,
                                pointRadius: 0,
                                pointHoverRadius: 6,
                                backgroundColor: graphColor2,
                                borderColor: graphColor1,
                                pointHoverBackgroundColor: 'rgb(0,0,0)',
                                pointBorderColor: graphColor1,
                                pointBackgroundColor: graphColor1,
                                borderWidth: 2,
                                data: resData.reverse(),
                            }]
                        }
                        setAPIGraph(APIGraph);

                    })
                )
        } catch(error) {
            console.log(error);
        }
    }

    if(loading){
        <h1>Carregando...</h1>
    }

    // o useMemo foi utilizado para que não seja renderizado novamente ao mexer em coisas desvinculadas ao 'options'
    const currencyList = useMemo(() => {
        return Object.keys(options || {});
    }, [options])

        return (
            <div id="application">

                <div id="currency:1">
                    <input
                        value={coinA_value}
                        type="number"
                        min="0"
                        onChange={
                            (event) => {
                                let inputValue = event.target.value;
                                setCoinA_value(inputValue);
                                Converter(inputValue);
                            }
                        }
                    />
                    <select value={coinA_type} onChange={(event) => {setCoinA_type(event.target.value)}} id="converter">
                        {currencyList.map((key) => {
                            if(((key === 'USD' || key === 'BRL' || key === 'EUR') && selected !== 0 && !(key === coinB_type)) || (selected !== 1 )){
                                return (<option value={key} key={key+"converter"}>{options[key]}</option>)
                            }
                        })}
                    </select>
                </div>

                <div>
                    <button onClick={() => { Swap() }}>Inverter</button>
                </div>

                <div id="currency:2">

                    <input disabled value={coinB_value} />
                    <select value={coinB_type} onChange={(event) => {setCoinB_type(event.target.value)}} id="converted">
                        {currencyList.map((key) => {
                            if(((key === 'USD' || key === 'BRL' || key === 'EUR') && selected === 0 && !(key === coinA_type)) || (selected === 1 )){
                               return (<option value={key} key={key+"converted"}>{options[key]}</option>)
                            }
                        })}
                    </select>
                </div>

                <div id="graph-app">

                    <div id="graph-buttons">

                        <button onClick={() => { Period('1H'); }}>1H</button>

                        <button onClick={() => { Period('15D') }}>15D</button>

                        <button onClick={() => { Period('1M') }}>1M</button>

                        <button onClick={() => { Period('3M') }}>3M</button>

                        <button onClick={() => { Period('6M') }}>6M</button>

                        <button onClick={() => { Period('1A') }}>1A</button>

                    </div>

                </div>

                <div>
                    { APIGraph !== null ? (< Line data = {APIGraph} />) : <h4> Aguardando Gráfico... </h4>}
                </div>
            </div>
        )
}
