import React, { Component } from 'react';

export default class Randomize extends Component{

    constructor(props) {
        super(props);

        this.state = {
            a1: 'bolinha',
            b2: 0,
            c3: 0,
            d4: 0,
            e5: 0,
            f6: 0,
            g7: 0,
            h8: 0,
            i9: 0,
            j10: 0,
            k11: 0,
            l12: 0,
        }

        this.randomMaster = this.randomMaster.bind(this);
    }

    randomMaster() {
        const a1 = Math.random().toFixed(3),
                b2 = Math.random().toFixed(3),
                c3 = Math.random().toFixed(3),
                d4 = Math.random().toFixed(3),
                e5 = Math.random().toFixed(3),
                f6 = Math.random().toFixed(3),
                g7 = Math.random().toFixed(3),
                h8 = Math.random().toFixed(3),
                i9 = Math.random().toFixed(3),
                j10 = Math.random().toFixed(3);

        this.setState({ a1,b2,c3,d4,e5,f6,g7,h8,i9,j10 });
    }

    render() {

        return (
            <div id="application">

                <div id="abc">
                    <h3>{this.state.a1}</h3>
                    <button onClick={(event) => {this.setState({ a1: 'Cachorro' })}}>Biluga</button>

                    <h3>{this.state.b2}</h3>
                    <button onClick={(event) => {this.setState({ b2: Math.random().toFixed(4) })}}>Rosquinha</button>

                    <h3>{this.state.c3}</h3>
                    <button onClick={(event) => {this.setState({ c3: Math.random().toFixed(2) })}}>Pato No Tucupí</button>

                    <h3>{this.state.d4}</h3>
                    <button onClick={(event) => {this.setState({ d4: Math.random().toFixed(5) })}}>Setor 4</button>

                    <h3>{this.state.e5}</h3>
                    <button onClick={(event) => {this.setState({ e5: Math.random().toFixed(3) })}}>ABC da Amazônia</button>

                    <h3>{this.state.f6}</h3>
                    <button onClick={(event) => {this.setState({ f6: Math.random().toFixed(1) })}}>Sei Lá garai</button>

                    <h3>{this.state.g7}</h3>
                    <button onClick={(event) => {this.setState({ g7: Math.random().toFixed(6) })}}>zzZzzz</button>

                    <h3>{this.state.h8}</h3>
                    <button onClick={(event) => {this.setState({ h8: Math.random().toFixed(4) })}}>Eita nóix</button>

                    <h3>{this.state.i9}</h3>
                    <button onClick={(event) => {this.setState({ i9: Math.random().toFixed(5) })}}>Processador</button>

                    <h3>{this.state.j10}</h3>
                    <button onClick={(event) => {this.setState({ j10: Math.random().toFixed(3) })}}>Batalha Naval</button>

                    <br/><button type="number" onClick={(event) => {this.setState({ k11: Math.random().toFixed(5) })}}>{this.state.k11}</button>

                    <button onClick={this.randomMaster}>CHAVE MESTRA</button>

                </div>

            </div>
        )
    }
}
