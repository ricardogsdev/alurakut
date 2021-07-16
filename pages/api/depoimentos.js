import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequestsDepo(request, response){

  if(request.method === 'POST') {
    const TOKEN = '03ecfd27aad15b05186dc181ce282c';
    const client = new SiteClient(TOKEN);
  
    const registroCriado = await client.items.create({
      itemType: '972688',
      ...request.body,
    })
  
    response.json({
      dados: 'dado qualquer',
      registroCriado: registroCriado,
    })
    return
  }
  response.status(404).json({
    message: 'Ainda não temos nada no GET. mas no POST tem!'
  })
}