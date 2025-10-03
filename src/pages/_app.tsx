import { Box } from '@mui/material'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import React from 'react';
import { Header } from '@/components/Header';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <Header />
      <Box sx={{ padding: 2 }}>
        <Component {...pageProps} />
      </Box>
    </>
  )
}