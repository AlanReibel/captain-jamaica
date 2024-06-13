var e=Object.defineProperty,t=(t,s,i)=>(((t,s,i)=>{s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[s]=i})(t,"symbol"!=typeof s?s+"":s,i),i);import{p as s}from"./phaser-C2_wa_Fb.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();class i extends s.Scene{constructor(){super("Boot")}preload(){this.load.image("background","assets/orange-skyline.png"),this.load.spritesheet("captain-idle","assets/sprites/captain/idle.png",{frameWidth:512,frameHeight:465}),this.load.spritesheet("captain-run","assets/sprites/captain/run.png",{frameWidth:512,frameHeight:465}),this.load.spritesheet("captain-fight","assets/sprites/captain/fight.png",{frameWidth:512,frameHeight:512}),this.load.spritesheet("shield-throw","assets/sprites/captain/shield-throw.png",{frameWidth:600,frameHeight:512}),this.load.spritesheet("shield-fly","assets/sprites/captain/shield-fly.png",{frameWidth:256,frameHeight:160})}create(){this.scene.start("Preloader")}}class a{constructor(e,t,s,i){this.scene=e,this.sprite=e.physics.add.sprite(t,s,i),this.sprite.setBounce(.2).setCollideWorldBounds(!0).setScale(.2),console.log("player",this.sprite),this.createAnimations(),this.sprite.anims.play("idle",!0),this.shield=e.physics.add.sprite(this.x,this.y,"shield-fly"),this.shield.body.setAllowGravity(!1),this.shield.setScale(.4),this.shield.setVisible(!1),this.shield.on("animationcomplete-fly",((e,t)=>{console.log(`animation ${e.key} complete`),"fly"===e.key&&(this.scene.fightEnds=!0)}))}createAnimations(){this.scene.anims.create({key:"idle",frames:this.scene.anims.generateFrameNumbers("captain-idle",{start:0,end:6}),frameRate:12,repeat:-1}),this.scene.anims.create({key:"run",frames:this.scene.anims.generateFrameNumbers("captain-run",{start:0,end:9}),frameRate:12,repeat:-1}),this.scene.anims.create({key:"punch",frames:this.scene.anims.generateFrameNumbers("captain-fight",{start:1,end:3}),frameRate:12,repeat:0}),this.scene.anims.create({key:"kick",frames:this.scene.anims.generateFrameNumbers("captain-fight",{start:4,end:7}),frameRate:12,repeat:0}),this.scene.anims.create({key:"shield",frames:this.scene.anims.generateFrameNumbers("captain-fight",{start:8,end:11}),frameRate:12,repeat:0}),this.scene.anims.create({key:"throw",frames:this.scene.anims.generateFrameNumbers("shield-throw",{start:0,end:5}),frameRate:12,repeat:0}),this.scene.anims.create({key:"catch",frames:this.scene.anims.generateFrameNumbers("shield-throw",{start:12,end:15}),frameRate:12,repeat:0}),this.scene.anims.create({key:"fly",frames:this.scene.anims.generateFrameNumbers("shield-fly",{start:0,end:7}),frameRate:12,repeat:0});let e=["punch","kick","shield","fly","catch"];this.sprite.on("animationcomplete",((t,s)=>{e.includes(t.key)&&(this.scene.fightEnds=!0)}))}}class r{constructor(e){this.scene=e,this.cursors=e.input.keyboard.createCursorKeys(),this.wKey=e.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),this.aKey=e.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),this.sKey=e.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),this.dKey=e.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),this.qKey=e.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),this.eKey=e.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),this.fKey=e.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)}isFightActionPressed(){return this.qKey.isDown||this.eKey.isDown||this.fKey.isDown||this.cursors.space.isDown}isMovementKeyPressed(){return this.cursors.left.isDown||this.cursors.right.isDown||this.aKey.isDown||this.dKey.isDown}isJumpKeyPressed(){return this.cursors.up.isDown||this.wKey.isDown}isFightActionLeaved(){return this.cursors.space.isUp&&this.qKey.isUp&&this.fKey.isUp&&this.eKey.isUp}}class n extends s.Scene{constructor(){super("Game"),t(this,"player"),t(this,"inputHandler"),t(this,"score",0),t(this,"textScore"),t(this,"lives",3),t(this,"textLives"),t(this,"gameOver",!1),t(this,"map"),t(this,"movingDirection","right"),t(this,"blockedFight",!1),t(this,"fightEnds",!0),t(this,"shieldThrown",!1),t(this,"shieldCached",!0),t(this,"enemy")}create(){this.gameOver=!1,this.add.image(this.game.config.width/2,this.game.config.height/2,"background"),this.add.image(400,300,"background"),this.player=new a(this,100,400,"captain-idle"),this.inputHandler=new r(this),this.createEnemy()}update(){this.inputHandler.isFightActionLeaved()&&(this.blockedFight=!1),this.inputHandler.isFightActionPressed()&&!this.blockedFight&&this.handleFightActions(),this.fightEnds&&this.handleMovement(),this.inputHandler.isJumpKeyPressed()&&this.player.sprite.body.blocked.down&&(this.player.sprite.setVelocityY(-550),this.player.sprite.body.setGravityY(600)),this.gameOver&&this.scene.start("GameOver")}handleFightActions(){this.inputHandler.qKey.isDown?(this.blockedFight=!0,this.fightEnds=!1,this.player.sprite.anims.play("punch",!0)):this.inputHandler.eKey.isDown?(this.blockedFight=!0,this.fightEnds=!1,this.player.sprite.anims.play("kick",!0)):this.inputHandler.fKey.isDown?(this.blockedFight=!0,this.fightEnds=!1,this.shieldCached&&!this.shieldThrown&&(this.shieldThrown=!0,this.throwShield())):this.inputHandler.cursors.space.isDown&&(this.blockedFight=!0,this.fightEnds=!1,this.player.sprite.anims.play("shield",!0))}handleMovement(){this.inputHandler.cursors.left.isDown||this.inputHandler.aKey.isDown?(this.movingDirection="left",this.player.sprite.setVelocityX(-200),this.player.sprite.anims.play("run",!0).setFlipX(!0)):this.inputHandler.cursors.right.isDown||this.inputHandler.dKey.isDown?(this.movingDirection="right",this.player.sprite.setVelocityX(200),this.player.sprite.anims.play("run",!0).setFlipX(!1)):(this.player.sprite.setVelocityX(0),this.player.sprite.anims.play("idle",!0))}throwShield(){this.player.sprite.anims.play("throw",!0),this.time.delayedCall(375,(()=>{let e={x:"right"==this.movingDirection?this.player.sprite.x+this.player.sprite.body.width/2:this.player.sprite.x-this.player.sprite.body.width/2,y:this.player.sprite.y};this.player.shield.setPosition(e.x,e.y),this.player.shield.setVisible(!0),this.player.shield.play("fly",!0);let t="right"==this.movingDirection?e.x+300:e.x-300;this.tweens.add({targets:this.player.shield,x:t,y:e.y,duration:333,ease:"Power1",onComplete:()=>{this.flyBackTween()}})}))}flyBackTween(){this.tweens.add({targets:this.player.shield,x:this.player.sprite.x,y:this.player.sprite.y,duration:333,ease:"Power1",onComplete:()=>{this.player.shield.setVisible(!1),this.shieldThrown=!1,this.shieldCached=!0,this.player.sprite.anims.play("catch",!0)}})}destroyEnemy(e,t){t.destroy(),console.log("enemy overlap"),this.createEnemy()}createEnemy(){let e=this.player.sprite.x<this.game.config.width/2?this.game.config.width-50:50;this.enemy=this.add.rectangle(e,this.game.config.height-50,50,50,65280),this.physics.add.existing(this.enemy),this.enemy.body.setCollideWorldBounds(!0),this.physics.add.collider(this.player.shield,this.enemy,this.destroyEnemy,null,this),this.physics.add.overlap(this.player.sprite,this.enemy,this.handleBodyCollision,null,this)}handleBodyCollision(e,t){const s=e.anims.currentAnim.key;"punch"!==s&&"kick"!==s&&"shield"!==s||this.destroyEnemy(null,t)}}class h extends s.Scene{constructor(){super("GameOver")}create(){this.cameras.main.setBackgroundColor(16711680),this.add.image(this.game.config.width/2,this.game.config.height/2,"background").setAlpha(.5),this.add.text(this.game.config.width/2,this.game.config.height/2,"Game Over",{fontFamily:"Arial Black",fontSize:64,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.input.once("pointerdown",(()=>{this.scene.start("MainMenu")}))}}class o extends s.Scene{constructor(){super("MainMenu")}create(){this.add.image(this.game.config.width/2,this.game.config.height/2,"background"),this.add.text(this.game.config.width/2,this.game.config.height/2,"Captain Jamaica Prototype",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.input.once("pointerdown",(()=>{this.scene.start("Game")}))}}class d extends s.Scene{constructor(){super("Preloader")}init(){this.add.image(512,384,"background"),this.add.rectangle(512,384,468,32).setStrokeStyle(1,16777215);const e=this.add.rectangle(282,384,4,28,16777215);this.load.on("progress",(t=>{e.width=4+460*t}))}preload(){this.load.setPath("assets")}create(){this.scene.start("MainMenu")}}const l={type:Phaser.AUTO,width:792,height:594,parent:"game-container",backgroundColor:"#028af8",scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},pixelArt:!0,physics:{default:"arcade",arcade:{gravity:{y:500},debug:!0}},scene:[i,d,o,n,h]};new Phaser.Game(l);
