import React from 'react';
import MainGrid from '../src/components/MainGrid'
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
              <figure style={{ width: "20%", marginBottom: "20px" }}>
                <img src={itemAtual.fotodepo} style={{ borderRadius: "1000%" }} />
              </figure>
              <div style={{ padding: "30px" }}>
                <p>{itemAtual.depoimento}</p>
              </div>  
            </div>
            
          )
        })}
      </div>
    </Box>
  )
}

export default function Home() {
  const [comunidades, setComunidades] = React.useState([]);
  const [depoimentos, setDepoimentos] = React.useState([]);
  
  //const comunidades = ['Alurakut'];
  const usuarioAleatorio = 'ricardogsdev';
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
    fetch('https://api.github.com/users/peas/followers?per_page=6')
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
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle"> Crie uma Comunidade. </h2>
            <form onSubmit={function handleCriaComunidade(e){
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);
              console.log('Campo: ', dadosDoForm.get('title'));
              console.log('Campo: ', dadosDoForm.get('image'));

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: usuarioAleatorio,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                console.log(dados.registroCriado);
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas)
              })
              
            }}
            
            >
              <div style={{float: "left", width: "50%"}}>
                <input 
                  placeholder="Nome da comunidade?" 
                  name="title" 
                  aria-label="Nome da comunidade?"
                  type="text"
                />
              </div>
              <div style={{float: "left", width: "50%"}}>
                <input 
                  placeholder="URL da imagem" 
                  name="image" 
                  aria-label="URL da imagem"
                  type="text"
                />
              </div>
              <button >
                    Criar Comunidade
              </button>
            </form>
          </Box>
          <Box>
            <h2 className="subTitle"> Deixe um depoimento. </h2>
            <form onSubmit={function handleCriaDepoimento(e){
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);
              console.log('Campo: ', dadosDoForm.get('fotodepo'));
              console.log('Campo: ', dadosDoForm.get('depoimento'));

              const depoimento = {
                fotodepo: dadosDoForm.get('fotodepo'),
                depoimento: dadosDoForm.get('depoimento')
              }

              fetch('/api/depoimentos', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(depoimento)
              })
              .then(async (response) => {
                const dadosDepo = await response.json();
                console.log(dadosDepo.registroCriado);
                const depoimento = dadosDepo.registroCriado;
                const depoimentosAtualizados = [...depoimentos, depoimento];
                setDepoimentos(depoimentosAtualizados)
              })
              
            }}>

              <div>
                <input 
                  placeholder="" 
                  name="fotodepo" 
                  aria-label="foto depoimento"
                  type="hidden"
                  value= {fotoDepo}
                />
              </div>
              <div>
                <textarea
                  placeholder="Diga o que esta achando do curso..." 
                  name="depoimento" 
                  aria-label="Deixe um depoimento"
                  rows="5"
                  style={{ width: '100%',
                  display: 'block',
                  border: '1px solid var(--textQuarternaryColor)',
                  padding: '12px',
                  backgroundColor: 'var(--backgroundTertiary)',
                  borderRadius: 'var(--commonRadius)',
                  marginTop: '24px',
                  marginBottom: '16px'}}
                />
              </div>
              <button>
                Criar Depoimento
              </button>
            </form>
          </Box>
          <DepoimentosBox title="Depoimentos" items={depoimentos} />
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/comunities/${itemAtual.id}`} key={itemAtual.title}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`https://github.com/${itemAtual}`} key={itemAtual}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
