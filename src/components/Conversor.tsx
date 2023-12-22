import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { DateTime } from 'luxon';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useCurrency } from "contexts/Currency";

ChartJS.register(...registerables);

interface CurrencyVariables {
    options: any,
    loading: any,
}

export default function Conversor(){

    const [coinA_value, setCoinA_value] = useState<string>('1');
    const [coinB_value, setCoinB_value] = useState<string>('');
    const [coinA_type, setCoinA_type] = useState<string>("USD");
    const [coinB_type, setCoinB_type] = useState<string>("BRL");
    const [graphPeriod, setGraphPeriod] = useState<string>('');
    const [graphMode, setGraphMode] = useState<boolean>(false);
    const [APIGraph, setAPIGraph] = useState<any>(null);
    const [selected, setSelected] = useState<number>(0);
    const [btnAnimate, setBtnAnimate] = useState<string>('');

    const {options, loading} = useCurrency() as CurrencyVariables;

    const Converter = useCallback(
        async(inputValue: string|number) => {
            const from_to = `${coinA_type}${coinB_type}`
            const url = `https://economia.awesomeapi.com.br/json/last/${coinA_type}-${coinB_type}`

            try {
                const quotation = await fetch(url)
                    .then((e) => e.json())
                    .then((e) => e[from_to].bid);

                if (inputValue === "") {
                    setCoinB_value('');
                } else {
                    setCoinB_value(( (parseFloat as any) ((inputValue as number) * quotation).toFixed(2) ))
                }
            } catch (error) {
                console.error(error)
            }
        },
        [coinA_type, coinB_type]
    );

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

        setBtnAnimate("animate-rotate-icon");
            setTimeout(() => {
                setBtnAnimate('')
            }, 600);
    }

    const Season = useCallback (
        async(graphPeriod:string) => {
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
                                    pointRadius: 1,
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
        },
        [coinB_type, coinA_type]
    );

    if(loading){
        <h1>Carregando...</h1>
    }

    useEffect(() => {
        Converter(coinA_value);

        if(graphMode !== false || graphPeriod !== ''){
            Season(graphPeriod);
        }
    }, [coinA_type, coinB_type, coinA_value, graphPeriod, graphMode, Converter, Season]);


    function Period(buttonValue:string){
        setGraphPeriod(buttonValue);
    }

    // o useMemo foi utilizado para que não seja renderizado novamente ao mexer em coisas desvinculadas ao 'options'
    const currencyList = useMemo(() => {
        const messyList = Object.keys(options || {});
        return messyList.sort((a, b) => options[a].localeCompare(options[b]));
    }, [options])

        return (
            <div id="application" className='flex flex-wrap justify-center'>
                <div id='currency-panel' className='my-2 flex flex-nowrap items-center max-sm:flex-wrap max-sm:justify-center'>
                    <div id="currency1" className='flex flex-nowrap'>
                        <select
                            value={coinA_type}
                            onChange={(event) => {
                                setCoinA_type(event.target.value)
                            }}
                            id="converter"
                            className='w-40 h-8 relative overflow-hidden rounded-tl-lg rounded-bl-lg py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20'
                        >
                            {currencyList.map((key) => {
                                if(((key === 'USD' || key === 'BRL' || key === 'EUR') && selected !== 0 && !(key === coinB_type)) || (selected !== 1 )){
                                    return (<option value={key} key={key+"converter"}>{options[key]}</option>)
                                }
                                return null;
                            })}
                        </select>

                        <input
                            id='converter-input'
                            className='w-28 h-8 relative overflow-hidden rounded-tr-lg rounded-br-lg py-1.5 px-2 text-sm leading-5 ring-1 ring-gray-900/10 hover:ring-gray-900/20'
                            value={coinA_value}
                            type="number"
                            min="0"
                            placeholder='0'
                            onChange={
                                (event) => {
                                    let inputValue = event.target.value;
                                    setCoinA_value(inputValue);
                                    Converter(inputValue);
                                }
                            }
                        />
                    </div>
                    <div id="btn-swap" className='mx-2 flex flex-nowrap max-sm:w-full max-sm:justify-center'>
                        <button
                            id="btn-default"
                            className='w-12 h-12 flex justify-center items-center'
                            onClick={() => { Swap() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" id="arrow-path" className={btnAnimate} height="28px" width="28px">
                                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div id="currency2" className='flex flex-nowrap'>

                        <input
                            id="converted-input"
                            placeholder='0'
                            disabled
                            value={coinB_value}
                            className='w-28 h-8 relative overflow-hidden rounded-tl-lg rounded-bl-lg py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20 max-sm:order-1 max-sm:rounded-none max-sm:rounded-br-lg max-sm:rounded-tr-lg'
                        />
                        <select
                            value={coinB_type}
                            onChange={(event) => {
                                setCoinB_type(event.target.value)
                            }}
                            id="converted"
                            className='w-40 h-8 relative overflow-hidden rounded-tr-lg rounded-br-lg py-1.5 px-2 text-sm leading-5 ring-1 ring-gray-900/10 hover:ring-gray-900/20 max-sm:rounded-none max-sm:rounded-tl-lg max-sm:rounded-bl-lg'
                        >
                            {currencyList.map((key) => {
                                if(((key === 'USD' || key === 'BRL' || key === 'EUR') && selected === 0 && !(key === coinA_type)) || (selected === 1 )){
                                    return (<option value={key} key={key+"converted"}>{options[key]}</option>)
                                }
                                return null;
                            })}
                        </select>
                    </div>
                </div>
                <div id="graph-app" className='mb-2 flex flex-row basis-full justify-center'>

                    <div id="graph-buttons" className='flex flex-wrap'>

                        <button id="btn-primary" onClick={() => { Period('1H'); }}>1H</button>

                        <button id="btn-primary" onClick={() => { Period('15D') }}>15D</button>

                        <button id="btn-primary" onClick={() => { Period('1M') }}>1M</button>

                        <button id="btn-primary" onClick={() => { Period('3M') }}>3M</button>

                        <button id="btn-primary" onClick={() => { Period('6M') }}>6M</button>

                        <button id="btn-primary" onClick={() => { Period('1A') }}>1A</button>

                    </div>

                </div>

                <div id="graph-res" className='flex flex-wrap w-70% justify-center max-xl:w-11/12 max-sm:w-full'>
                    { APIGraph !== null ? (< Line data = {APIGraph} />) : <h4> Selecione uma das opções acima! </h4>}
                </div>

            </div>
        )
}
