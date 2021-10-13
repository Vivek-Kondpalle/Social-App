import React from 'react'
import store from "./store"
import App from "./App"
import {Provider} from "react-redux"


const RootApp = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

export default RootApp
