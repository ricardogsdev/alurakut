import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGridAmigos from '../src/components/MainGrid/amigos.js'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr/>
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr/>
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}
function ProfileRelationsBox(propriedades) {
  return(
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      
      <ul>
        {propriedades.items.map((itemAtual) => {
          return (
              <li key={itemAtual.id}>
              <a href={itemAtual.html_url} key={itemAtual.id}>
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}
function DepoimentosBox(propriedades) {
  return(
    <Box>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      
      <div>
        {propriedades.items.map((itemAtual) => {
          return (
              <div key={itemAtual.id} style={{ 
                display: "flex",
                marginTop: "12px",
                marginBottom: "8px",
                borderBottom: "1px solid #e1e1e1",
                }}>
              <figure style={{ width: "10%", marginBottom: "10px" }}>
                <a href={`https://github.com/${itemAtual.fotodepo}`} key={itemAtual}><img src={`https://github.com/${itemAtual.fotodepo}.png`} style={{ borderRadius: "1000%" }} /></a>
              </figure>
              <div style={{ padding: "10px" }}>
                <p>{itemAtual.depoimento}</p>
                <span style={{ fontSize: "10px"}}>por:<a href={`https://github.com/${itemAtual.fotodepo}`} style={{ textDecoration: "none", color: "#673ab7" }}> @{itemAtual.fotodepo}</a></span>
              </div>  
            </div>
            
          )
        })}
      </div>
    </Box>
  )
}

export default function Home(props) {
  const [comunidades, setComunidades] = React.useState([]);
  const [depoimentos, setDepoimentos] = React.useState([]);
  
  //const comunidades = ['Alurakut'];
  const usuarioAleatorio = props.githubUser;
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]
  const fotoDepo = 'https://picsum.photos/300/300?' + Math.random();
 
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function(){
    fetch('https://api.github.com/users/peas/followers?per_page=18')
    .then(function(respostaDoServidor){
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta){
      setSeguidores(respostaCompleta); 
    })

     // API GraphQL
     fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '03ecfd27aad15b05186dc181ce282c',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id 
          title
          imageUrl
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      console.log(comunidadesVindasDoDato)
      setComunidades(comunidadesVindasDoDato)
    })

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '03ecfd27aad15b05186dc181ce282c',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allTestimonials {
        id
        depoimento 
        fotodepo
       }
      }` })
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompletaDepo) => {
      const depoimentosVindasDoDato = respostaCompletaDepo.data.allTestimonials;
      console.log(depoimentosVindasDoDato)
      setDepoimentos(depoimentosVindasDoDato)
    })
  }, []) 

  return (
    <>
      <AlurakutMenu />
      <MainGridAmigos>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'welcomeArea' }}>
          <ProfileRelationsBox title="seguidores" items={seguidores} />
        </div>
      </MainGridAmigos>
    </>
  )
}

export async function getServerSideProps(context){
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((resposta) => resposta.json())
  console.log('Usuário Logado: ', isAuthenticated);
  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }
  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, //will be passed to the page component as props
  }
}
