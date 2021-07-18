import styled from 'styled-components';
const MainGridComunidades = styled.main`
  width: 100%;
  grid-gap: 10px;
  margin-left: auto;
  margin-right: auto;
  max-width: 500px;
  padding: 16px;
  height: 500px;
  .profileArea {
    display: none;
    @media(min-width: 860px) {
      display: block;
    }
  }
  .profileRelationsArea .Box-sc-blt3eh-0 {
    height: 425px;
    @media(max-width: 760px) {
      height: 1000px;
    }
  }
  
  @media(min-width: 860px) {
    max-width: 1110px;
    display: grid;
    grid-template-areas: 
      "profileArea welcomeArea";
    grid-template-columns: 160px 1fr;
  }
  @media(min-width: 760px) {
  ul{
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
  }
`;
export default MainGridComunidades;