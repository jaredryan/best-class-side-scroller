import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import App from './main/App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
    <MuiThemeProvider>
        <App/>
    </MuiThemeProvider>,
    document.getElementById('root')
)
