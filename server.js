const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const weather = require('weather-js')
const fs = require('fs');
const db = require('quick.db');
const http = require('http');
require('./util/eventLoader')(client);
const path = require('path');
const request = require('request');
const snekfetch = require('snekfetch');
const queue = new Map();
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');


const express = require('express')
const app = express()
// OTM ^-^
app.get('/', (req, res) => res.send('OTM Bot Aktif')) // sitenize girdiğinde görebilirsiniz.
app.listen(process.env.PORT, () => console.log('Port ayarlandı: ' + process.env.PORT))

var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });


client.login(ayarlar.token);


//-----------------------------------------------------SAĞ TIK BAN KORUMASI-----------------------------------------------//
client.on("guildBanAdd", async function(guild, user) {
let ackapa = await db.fetch(`bankoruma_${guild.id}`);
  if (!ackapa) return;
  if (ackapa == "acik") {
    const entry = await guild
      .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
      .then(audit => audit.entries.first());
    
    const yetkili = await guild.members.get(entry.executor.id);
  setTimeout(async () =>{
      let logs = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'});

    
      if(logs.entries.first().executor.bot) return;
       if (logs.entries.first().executor.id === "396771835116781570") return; //Benim id
       if (logs.entries.first().executor.id === "1052942316962320415") return; //Almina id
       if (logs.entries.first().executor.id === "852916587468029982") return; //Orhan dahil id
       if (logs.entries.first().executor.id === "726481642553606155") // Kerem
       if (log.entries.first().executor.id === "757390234739671132") // Ramiz
    
      
        yetkili.ban(yetkili);(logs.entries.first().executor.id)
    

    
  guild.channels.get("1042526838834073620").send(`\`${user.tag}\` Adlı  Kullanıcı Banladı Ve Banlayanın Yetkilerini Alıp Banladım.`)
                       ////log kanal id

  
  
  },1000)
  }
  
 })


//-----------------------------------------------------SAĞ TIK BAN KORUMASI-----------------------------------------------//

//-----------------------------------------------------ROL KORUMASI-----------------------------------------------//
client.on("roleDelete", async(role , channel , message , guild) => {
  let rolkoruma = await db.fetch(`rolk_${role.guild.id}`);
    if (rolkoruma == "acik") {
      let logs = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'});
     const silen = role.guild.member(logs.entries.first().executor).user  
         if(logs.entries.first().executor.bot) return;
      
      
      if(logs.entries.first().executor.bot) return;
      if (logs.entries.first().executor.id === "396771835116781570") return; //Benim id
      if (logs.entries.first().executor.id === "1052942316962320415") return; //Almina id
      if (logs.entries.first().executor.id === "852916587468029982") return; //Orhan dahil id
      if (logs.entries.first().executor.id === "726481642553606155") // Kerem
      if (log.entries.first().executor.id === "757390234739671132") // Ramiz
    
      
  role.guild.ban(logs.entries.first().executor, 2)
      
          
        role.guild.channels.get("1042526838834073620").send(` **${role.name}** Adlı Rol Silindi Ve Silen Kişiyi Banladım  :white_check_mark:`)
                                 ////log kanal  id
 
}
})  

client.on("roleDelete",  async(role) => {
   let rolkoruma = await db.fetch(`rolk_${role.guild.id}`);
    if (rolkoruma == "acik") {
const rolyetki  = role.permissions;
const rolrenk  = role.color;
const rolisim  = role.name;
const rolment = role.mentionable;
const rolsira  = role.position;

role.guild.createRole({ name: rolisim,
 color: rolrenk,
permissions: rolyetki,
position: rolsira,
mentionable: rolment }) .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`)) .catch(console.error)
    }
});


client.on("roleCreate", async(role , channel , message , guild) => {
  let rolkoruma = await db.fetch(`rolk_${role.guild.id}`);
    if (rolkoruma == "acik") {
      let logs = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'});
     const silen = role.guild.member(logs.entries.first().executor).user  
   if(logs.entries.first().executor.bot) return;
      
      
      if(logs.entries.first().executor.bot) return;
      if (logs.entries.first().executor.id === "396771835116781570") return; //Benim id
      if (logs.entries.first().executor.id === "1052942316962320415") return; //Almina id
      if (logs.entries.first().executor.id === "852916587468029982") return; //Orhan dahil id
      if (logs.entries.first().executor.id === "726481642553606155") // Kerem
      if (log.entries.first().executor.id === "757390234739671132") // Ramiz
  role.guild.ban(logs.entries.first().executor, 2)
      
         
        role.guild.channels.get("1042526838834073620").send(` **${role.name}** Adlı Rol Oluşturuldu Ve Oluşturan Kişiyi Banladım  :white_check_mark:`)
                                ////log kanal id
 
}
})  





//-----------------------------------------------------ROL KORUMASI-----------------------------------------------//


//-----------------------------------------------------KANAL KORUMALARI-----------------------------------------------//
client.on("channelDelete", async(role , channel , message , guild, user) => {
  const kanalkoruma = await db.fetch(`kanalk_${role.guild.id}`);
    if (kanalkoruma == "acik") {
      let logs = await role.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'});
     const silen = role.guild.member(logs.entries.first().executor).user  
   if(logs.entries.first().executor.bot) return;
      
      
   if (logs.entries.first().executor.id === "396771835116781570") return; //Benim id
   if (logs.entries.first().executor.id === "1052942316962320415") return; //Almina id
   if (logs.entries.first().executor.id === "852916587468029982") return; //Orhan dahil id
   if (logs.entries.first().executor.id === "726481642553606155") // Kerem
   if (log.entries.first().executor.id === "757390234739671132") // Ramiz
      
      

  role.guild.ban(logs.entries.first().executor, 2)
      
         
   role.guild.channels.get("1042526838834073620").send(`Sunucunuzda Kanal Silindi Ve Silen Kişinin Yetkilerini Alıp Banladım.`)
                            ///log kanal id
                             
   
     } 
});


client.on("channelDelete", async function (channel) {
  
  const kanalkoruma = await db.fetch(`kanalk_${channel.guild.id}`);
    if (kanalkoruma == "acik") {
      
  if (channel.type === "voice") {
    console.log(`${channel.name} adlı sesli kanal silindi.`);
    let kategoriID = channel.parentID;
    let isim = channel.name;
    let sıra = channel.position;
    let limit = channel.userLimit;
    channel.guild.channels.get("1042526838834073620").send(
                                ///log kanal id
      `Merhaba. **${channel.guild.name}** adlı sunucunuzda, \`${channel.name}\` adlı sesli kanalı silindi ama ben o kanalı tekrardan onardım.`
    );
    channel.clone(this.name, true, false).then(kanal => {
      let z = kanal.guild.channels.get(kanal.id);
      z.setParent(z.guild.channels.find(channel => channel.id === kategoriID));
      z.edit({ position: sıra, userLimit: limit });
    });
  }
  if (channel.type === "text") {
    console.log(`${channel.name} adlı metin kanalı silindi.`);
    let açıklama = channel.topic;
    let kategoriID = channel.parentID;
    let isim = channel.name;
    let sıra = channel.position;
    let nsfw = channel.nsfw;
    channel.guild.channels.get("723653278449139742").send( `Merhaba. **${channel.guild.name}** adlı sunucunuzda, \`${channel.name}\` adlı metin kanalı silindi ama ben o kanalı tekrardan onardım.` );
    channel.clone(this.name, true, true).then(kanal => {
      let z = kanal.guild.channels.get(kanal.id);
      z.setParent(z.guild.channels.find(channel => channel.id === kategoriID));
      z.edit({ position: sıra, topic: açıklama, nsfw: nsfw });
    });
  }
    }
});



client.on("channelCreate", async(role , channel , message , guild, user) => {
  const kanalkoruma = await db.fetch(`kanalk_${role.guild.id}`);
    if (kanalkoruma == "acik") {
      let logs = await role.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'});
     const silen = role.guild.member(logs.entries.first().executor).user  
    if(logs.entries.first().executor.bot) return;
      
      
    if (logs.entries.first().executor.id === "396771835116781570") return; //Benim id
    if (logs.entries.first().executor.id === "1052942316962320415") return; //Almina id
    if (logs.entries.first().executor.id === "852916587468029982") return; //Orhan dahil id
    if (logs.entries.first().executor.id === "726481642553606155") // Kerem
    if (log.entries.first().executor.id === "757390234739671132") // Ramiz
     //  if (logs.entries.first().executor.id === "") return; //ihtimale dahil id
      
  role.guild.ban(logs.entries.first().executor, 2)
      
         role.guild.roles.forEach(async function(yetkilirol){
            if (logs.entries.first().executor.id === "396771835116781570") return; //Benim id
            if (logs.entries.first().executor.id === "1052942316962320415") return; //Almina id
            if (logs.entries.first().executor.id === "852916587468029982") return; //Orhan dahil id
            if (logs.entries.first().executor.id === "726481642553606155") // Kerem
            if (log.entries.first().executor.id === "757390234739671132") // Ramiz
               
  if(yetkilirol.hasPermission("ADMINISTRATOR")){
      yetkilirol.setPermissions((yetkilirol.permissions-8))   
     }
               });
      
   role.guild.channels.get("1042526838834073620").send( `Suncunuzda Kanal Oluşturuldu Ve Oluşturan Kişinin Yetkilerini Alıp Banladım.`)
     
                                 ///log kanal id
   
     } 
});

  


//-----------------------------------------------------KANAL KORUMALARI-----------------------------------------------//



//-----------------------------------------------------KULLANICI GÜNCELLEME KORUMASI-----------------------------------------------//
client.on("guildMemberUpdate", async(role , channel , message , guild, user) => {
  let kullanıcıkoruma = await db.fetch(`kullanıcık_${role.guild.id}`);
    if (kullanıcıkoruma == "acik") {
      let logs = await role.guild.fetchAuditLogs({type: 'MEMBERS_UPDATE'});
     const silen = role.guild.member(logs.entries.first().executor).user  
    if(logs.entries.first().executor.bot) return;
      
      
    if (logs.entries.first().executor.id === "396771835116781570") return; //Benim id
    if (logs.entries.first().executor.id === "1052942316962320415") return; //Almina id
    if (logs.entries.first().executor.id === "852916587468029982") return; //Orhan dahil id
    if (logs.entries.first().executor.id === "726481642553606155") // Kerem
    if (log.entries.first().executor.id === "757390234739671132") // Ramiz
      
  role.guild.ban(logs.entries.first().executor, 2)
                                                                
channel.guild.channels.get("1042526838834073620").send(`\`${user}\` Kullanıcısını Güncellemeye Çalıştığı İçin __Banlandı__. Güncellemeye Çalışan: \`${silen.tag}\``) ///kanal log id
    }
});
//-----------------------------------------------------KULLANICI GÜNCELLEME KORUMASI-----------------------------------------------//

//-----------------------------------------------------KULLANICI GÜNCELLEME KORUMASI-----------------------------------------------//
client.on("roleUpdate", async(role , channel , message , guild, user, member) => {
  
  

        
  

      let logs = await role.guild.fetchAuditLogs({type: 'ROLE_UPDATE'});
     const silen = role.guild.member(logs.entries.first().executor).user  
     if(logs.entries.first().executor.bot) return;
      
     if (logs.entries.first().executor.id === "396771835116781570") return; //Benim id
     if (logs.entries.first().executor.id === "1052942316962320415") return; //Almina id
     if (logs.entries.first().executor.id === "852916587468029982") return; //Orhan dahil id
     if (logs.entries.first().executor.id === "726481642553606155") // Kerem
     if (log.entries.first().executor.id === "757390234739671132") // Ramiz
  role.guild.ban(logs.entries.first().executor, 2)
      
    
      
                                                                
channel.guild.channels.get("1042526838834073620").send(`\`${role.name}\` Rolünü Güncellemeye Çalıştığı İçin __Banlandı__. Güncellemeye Çalışan: \`${silen.tag}\``) ///kanal log id
                             ////log kanal id
      
    });
//-----------------------------------------------------KULLANICI GÜNCELLEME KORUMASI-----------------------------------------------//


//-----------------------------------------------------BOT KORUMASI-----------------------------------------------//
client.on("guildMemberAdd", async member => {
  
  
   
    if(member.user.bot) {
      
     
      member.guild.roles.forEach(async function(yetkilirol){
        
  if(yetkilirol.id ==="1054351811697446952")return
  if(yetkilirol.hasPermission("ADMINISTRATOR")){
       yetkilirol.setPermissions((yetkilirol.permissions-8))    
     }
      })
      let korumakanalı = client.channels.get("1042526838834073620")
      if(!korumakanalı || korumakanalı === null){
        member.ban(member);
         
         member.guild.owner.send(`botkoruma-odası olmadığı içim sunucu sahibinin DM'sine yazıyorum.| **Sunucuya bir bot eklendi ve koruma nedeniyle botu banladım. \nBanlanan Bot: **${member}  `)
     }
      else{
        
      member.ban(member);
      korumakanalı.send(`** Sunucuya bir bot eklendi ve koruma nedeniyle botu banladım. \nBanlanan Bot: **${member}`)
     }
  }
    else{
      
    }
  
  })
client.on('guildMemberAdd', (member) => {
  
 

  if(member.user.bot){
  member.ban();
  };
}); 
//-----------------------------------------------------BOT KORUMASI-----------------------------------------------//

client.on('ready', () => {

client.channels.get('1042485458757763072').join()
})
