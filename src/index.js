import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import * as d3 from 'd3';

import './index.css';
import App from './App';

import drivers from "./data/drivers.csv";
import races from "./data/races.csv";
import results from "./data/results.csv";
import laptimes from "./data/lap_times.csv";
import constructors from "./data/constructors.csv";
import {downloadPreprocessedData} from "./preprocess";

const preprocessed = require('./data/preprocessed.json');
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

d3.csv(drivers).then(drivers => {
    d3.csv(races).then(races => {
        d3.csv(results).then(results => {
            d3.csv(laptimes).then(laptimes => {
                d3.csv(constructors).then(constructors => {
                    root.render(
                        <StrictMode>
                            <App preprocessed={preprocessed}
                                 drivers={drivers}
                                 races={races}
                                 results={results}
                                 laptimes={laptimes}
                                 constructors={constructors}/>
                        </StrictMode>
                    );
                });
            });
        });
    });
});
