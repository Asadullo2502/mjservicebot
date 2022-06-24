const express = require('express');
const app = express()
const cors = require('cors')



const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch');
const TOKEN = `5209262509:AAFTOLioXcJSy1t5WkE3zT76xCl8eJqs0c4`;

const bot = new TelegramBot(TOKEN, {
   polling: true
})


bot.on('message', async (message) => {
   const message_id = message.message_id
   const chatId = message.chat.id
   const name = message.from.first_name
   const text = message.text

   if (text == '/start') {
      // const keyboard = {
      //    resize_keyboard: true, // katayib ketmasligi uchun
      //    one_time_keyboard: true, // bitta bosgandan kegin yoqolishi 
      //    keyboard: [
      //       [
      //          {
      //             text: 'Toshkent',
      //             // request_contact: true, //contact sorash uchun
      //             request_poll: {
      //                type: 'quiz'
      //             }
      //          },
      //          {
      //             text: 'Boshqa',
      //             request_location: true
      //          }
      //       ]
      //    ]
      // }

      bot.sendMessage(chatId, `Salom <b>${name}</b>, parolni kiriting !`, {
         parse_mode: 'HTML',
         reply_to_message_id: message_id,
      })
   } else if (text == '/root') {
      let text = ''
      try {
         let response = await fetch('https://mjservicesbackend.herokuapp.com/orders')
         let res = await response.json()
         res.forEach(element => {
            let t = `${element?.user_name},
      ${element?.phone_number},
      ${element?.service_name}
      `
            text += `======
      ${t}
      `
         });
      } catch {
         text = 'Xatolik yuz berdi, qaytadan urinib ko`ring !'
      }


      bot.sendMessage(chatId, text, {
         parse_mode: 'HTML',
         reply_to_message_id: message_id,
      })

   } else if (text == '/photo') {
      bot.sendPhoto(chatId, 'https://picsum.photos/300', {
         caption: "Bu rasim !"
      })
   } else if (text == '/document') {
      bot.sendDocument(chatId, 'https://eloquentjavascript.net/Eloquent_JavaScript_small.pdf')
   } else if (text == '/media') {
      let mediaList = []


      mediaList.push({
         type: 'photo',
         media: 'https://picsum.photos/300?rand=1'
      })
      mediaList.push({
         type: 'photo',
         media: 'https://picsum.photos/300?rand=2'
      })
      mediaList.push({
         type: 'photo',
         media: 'https://picsum.photos/300?rand=3'
      })
      bot.sendMediaGroup(chatId, mediaList)
   } else if (text == '/locationMe') {
      bot.sendLocation(chatId, 46.21, 52.1)
   } else if (text == '/location') {
      bot.sendVenue(chatId, 46.21, 52.1, 'Chopot ota', 'Hello man')
   } else if (text == '/contact') {
      bot.sendContact(chatId, "+998994421261", 'Asadulloh')
   } else if (text == '/game') {
      await bot.sendChatAction(chatId, 'typing')
      let message = await bot.sendDice(chatId, {
         emoji: "🎲"
      })
      console.log(message)
   } else if (text == '/whoami') {
      let photos = await bot.getUserProfilePhotos(chatId)
      let msg = await bot.sendPhoto(chatId, photos.photos[0][2]?.file_id, {
         caption: 'Bu kishini taniysizmi ?'
      })

      setTimeout(() => {
         bot.deleteMessage(chatId, msg.message_id)
      }, [2000])
   }



})

bot.on('callback_query', message => {
   const cahtID = message.from.id
   const data = message.data
   const message_id = message.message.message_id

   if (data == 'tashkent') {
      bot.editMessageText('Siz toshkentni tanladingiz', {
         chat_id: cahtID,
         message_id: message_id
      })
   }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
   extended: true
}))

app.use('/', (req, res) => {
   res.send('USER')
})

const server = app.listen(process.env.PORT || 5000, () => {
   const port = server.address().port;
   console.log(`Express is working on port ${port}`);
});
