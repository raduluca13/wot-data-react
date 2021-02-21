import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import store from './slices/store';
// import WebSocketProvider from './WebSocketContext';

ReactDOM.render(
  <React.StrictMode>
    {/* <ThemeProvider theme={theme}> */}

    {/* <CssBaseline /> */}
    <Provider store={store}>
      {/* <WebSocketProvider> */}
        <App />
      {/* </WebSocketProvider> */}
    </Provider>

    {/* </ThemeProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
