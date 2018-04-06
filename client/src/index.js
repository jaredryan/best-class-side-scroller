import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux';
import './style.css';
import App from './main/App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

store.subscribe(() => {
    // console.log(store.getState());
})

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <MuiThemeProvider>
                <App/>
            </MuiThemeProvider>
        </Router>
    </Provider>,
    document.getElementById('root')
)
