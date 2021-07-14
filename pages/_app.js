import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { AlurakutStyles } from '../src/lib/AlurakutCommons';

const GlobalStyle = createGlobalStyle`
  /* Reset CSS (Necolas Reset CSS <3) */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    background: linear-gradient(to top, #5140bb 0%, #7144c2 100%);
    background-image: url('https://media-exp3.licdn.com/dms/image/C561BAQFWAWkrDxHtYw/company-background_10000/0/1611655676415?e=2159024400&v=beta&t=99F5WfOoGVHLUPekVp8LT0XQ9q6Vbro6qEKoHz4Ldqw');
    background-size: cover;
    background-repeat: no-repeat;
  }

  #__next {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ${AlurakutStyles}
`

const theme = {
  colors: {
    primary: 'red',
  },
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
