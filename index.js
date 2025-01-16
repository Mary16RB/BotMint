require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

let previousIdentifier = 1670;
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const options = {
  method: 'GET',
  url: 'https://api.opensea.io/api/v2/collection/piggies-4/nfts',
  params: { limit: 1 },
  headers: {
    accept: 'application/json',
    'x-api-key': '7d4c8906f87c4dcbb8114303f0130c9b',
  },
};

client.on('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);

  setInterval(async () => {
    try {
      const { newIdentifier, newImage, date } = await fetchNFTData();

      console.log(newIdentifier);

      if (newIdentifier !== previousIdentifier) {
        previousIdentifier = newIdentifier;
        console.log("mint"+ newIdentifier);

        notifyNewMint(newIdentifier, newImage, date);
      }
    } catch (error) {
      console.error('Error al verificar NFTs:', error);
    }
  }, 30000);
});

async function fetchNFTData() {
  const response = await axios.request(options);
 
  if (!response.data || !response.data.nfts || response.data.nfts.length === 0) {
    throw new Error('Datos de la API inválidos');
  }

  const nft = response.data.nfts[0];
  const newIdentifier = parseInt(nft.identifier, 10);
  const newImage = String(nft.image_url);
  const date= String(nft.updated_at);

  return { newIdentifier, newImage, date };
}

async function notifyNewMint(identifier, image, DATE) {
  const channel = client.channels.cache.get('1219684982902226964');
  if (!channel) {
    console.error('Canal no encontrado');
    return;
  }

  const dateObj = new Date(DATE);
  const date = dateObj.toISOString().split("T")[0]; // Fecha en formato ISO
  const time = dateObj.toTimeString().split(" ")[0]; // Hora sin milisegundos

  const embed = new EmbedBuilder()
    .setTitle('New minted Piggie')
    .setDescription(`**NFT ID: #** ${identifier}\n\n**Date: ** ${date}\n**Hour: ** ${time}\n\n[Mint Site](https://launchpad.heymint.xyz/mint/piggies)\n[View on Marketplace](https://magiceden.io/collections/polygon/0x268Fba721CFD580FE98d96f1b0249f6871D1Fa09)`)
    .setColor(0xc45682)
    .setImage(image);

  channel.send({ embeds: [embed] });
}

client.login(process.env.DISCORD_TOKEN);