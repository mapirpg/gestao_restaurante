import { AppBar, Box, Button, Divider, Toolbar } from '@mui/material'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import React from 'react';

export default function App({ Component, pageProps }: AppProps) {

  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Clientes', path: '/clientes' },
    { name: 'Produtos', path: '/produtos' },
    { name: 'Pedidos', path: '/pedidos' },
  ]

  return (
    <>
      <AppBar position="sticky">
        <Toolbar variant="dense" sx={{ gap: 2 }} >
          {routes.map(route => (
            <React.Fragment key={route.name}>
              <Button color="inherit" href={route.path}>{route.name}</Button>
              <Divider orientation="vertical" flexItem />
            </React.Fragment>
          ))}
        </Toolbar>
      </AppBar>
      
      <Box sx={{ padding: 2 }}>
        <Component {...pageProps} />
      </Box>
    </>
  )
}