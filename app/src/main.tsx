import React from 'react'
import ReactDOM from 'react-dom/client'
import {ReactQueryDevtools} from 'react-query/devtools'
import { QueryClientProvider } from 'react-query'
import App from './App'
import {QueryClient} from "react-query";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools/>
            <App/>
        </QueryClientProvider>
    </React.StrictMode>
)
