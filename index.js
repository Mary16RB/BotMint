require ('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
// Cargar metadatos de NFTs
//const metadatos = JSON.parse(fs.readFileSync('metadatos_nft.json', 'utf8')); //leer metadatos de files json

let cont=[];
let state=false;
let previousState = state;
let img=[];
let fecha=[];

const options = {
  method: 'GET',
  url: 'https://api.opensea.io/api/v2/collection/piggies-4/nfts',
  params: {
    limit: 1
  },
  headers: {
    accept: 'application/json',
    'x-api-key': '7d4c8906f87c4dcbb8114303f0130c9b',
  }
};

// Crear cliente de Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Evento: El bot está listo
client.on('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);

  setInterval(async () => {
    try {
        await waitForCont();

        console.log("mint: "+cont[cont.length - 1]);

    // Verificar si el archivo existe
    if (state !== previousState) {

      const channel = client.channels.cache.get('1219684982902226964');
      const mint= cont[cont.length - 1];
      const fet=fecha[0];
      const url_img=img[0];

      const dateObj = new Date(fet);
      const date = dateObj.toISOString().split("T")[0]; // Fecha en formato ISO
      const time = dateObj.toTimeString().split(" ")[0]; // Hora sin milisegundos
      
      console.log("miteando");
      const embed1 = new EmbedBuilder()
        
        .setTitle(`New minted Piggies`)
        .setDescription(`**NFT ID: #** ${mint}\n\n**Date: ** ${date}\n**Hour: ** ${time}\n\n[Mint Site](https://launchpad.heymint.xyz/mint/piggies)\n[View on Marketplace](https://magiceden.io/collections/polygon/0x268Fba721CFD580FE98d96f1b0249f6871D1Fa09)`)
        .setColor(0xc45682)
        .setImage(url_img);
        
      
       await channel.send({
        embeds: [embed1]

      });
      previousState = state;
   }
    } catch (error) {
        console.error('Error de tiempo:', error);
    }

}, 60000);

});

// Evento: Mensajes recibidos

  // Ignorar mensajes del bot

  //const channel = client.channels.cache.get('1219684982902226964');

 // Buscar comandos tipo "!piggies<ID>"

// Iniciar el bot
client.login(process.env.DISCORD_TOKEN);

async function waitForCont() {
  // Esperar hasta que cont sea distinto de 0
 
    console.log("Esperando a que cont sea diferente de 0...");
    try {

    const res = await axios.request(options);
    const cont2 = res.data.nfts[0].identifier; // Actualizar cont con el valor correcto
    const imagen= res.data.nfts[0].image_url;
    const date=res.data.nfts[0].updated_at;
    const cont3 = parseInt(cont2, 10);

    if(cont3==cont[cont.length - 1]){
      console.log("No cambio");

    }else{
      cont.push(cont3);
      console.log("cambio");

      img[0]=String(imagen);
      fecha[0]=String(date);
      state=!state;
    }
  
    }catch (error) {
      console.error('Error:', error);
  }
}