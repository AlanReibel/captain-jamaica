var t=Object.defineProperty,e=(e,s,i)=>(((e,s,i)=>{s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i})(e,"symbol"!=typeof s?s+"":s,i),i);import{p as s}from"./phaser-C2_wa_Fb.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver((t=>{for(const s of t)if("childList"===s.type)for(const t of s.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&e(t)})).observe(document,{childList:!0,subtree:!0})}function e(t){if(t.ep)return;t.ep=!0;const e=function(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?e.credentials="include":"anonymous"===t.crossOrigin?e.credentials="omit":e.credentials="same-origin",e}(t);fetch(t.href,e)}}();class i extends s.Scene{constructor(){super("Boot")}preload(){this.loadAudios(),this.loadImages(),this.loadSpriteSheets(),this.loadTileMaps()}create(){this.scene.start("Preloader")}loadAudios(){this.load.audio("bitest","assets/sounds/bitest.mp3"),this.load.audio("laser","assets/sounds/laser2.mp3"),this.load.audio("punch","assets/sounds/punch.mp3"),this.load.audio("boomerang","assets/sounds/boomerang2.mp3"),this.load.audio("die","assets/sounds/retro_die_02.mp3")}loadSpriteSheets(){this.load.spritesheet("captain-idle","assets/sprites/captain/idle.png",{frameWidth:512,frameHeight:465}),this.load.spritesheet("captain-run","assets/sprites/captain/run.png",{frameWidth:512,frameHeight:465}),this.load.spritesheet("captain-fight","assets/sprites/captain/fight.png",{frameWidth:512,frameHeight:512}),this.load.spritesheet("shield-throw","assets/sprites/captain/shield-throw.png",{frameWidth:600,frameHeight:512}),this.load.spritesheet("shield-fly","assets/sprites/captain/shield-fly.png",{frameWidth:256,frameHeight:160}),this.load.aseprite({key:"shot",textureURL:"assets/sprites/captain/shot.png",atlasURL:"assets/sprites/captain/shot.json"})}loadImages(){this.load.image("background","assets/orange-skyline.png"),this.load.image("bullet","assets/sprites/captain/bullet.png"),this.load.image("foreground","assets/background/0000_foreground.png"),this.load.image("buildings","assets/background/0001_buildings.png"),this.load.image("farBuildings","assets/background/0002_far-buildings.png"),this.load.image("bg","assets/background/0003_bg.png")}loadTileMaps(){}}class r extends s.Scene{constructor(){super("Preloader")}init(){this.add.image(512,384,"background"),this.add.rectangle(512,384,468,32).setStrokeStyle(1,16777215);const t=this.add.rectangle(282,384,4,28,16777215);this.load.on("progress",(e=>{t.width=4+460*e}))}preload(){this.load.setPath("assets")}create(){this.scene.start("MainMenu")}}class n extends s.Scene{constructor(){super("MainMenu")}create(){this.add.image(this.game.config.width/2,this.game.config.height/2,"background"),this.add.text(this.game.config.width/2,this.game.config.height/2,"Captain Jamaica Prototype",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.input.once("pointerdown",(()=>{this.scene.start("Game")}))}}class h{constructor(t,e,s,i){this.scene=t,this.sprite=t.physics.add.sprite(e,s,i),this.sprite.setBounce(.2).setCollideWorldBounds(!0).setScale(.2),this.createAnimations(),this.sprite.anims.play("idle",!0),this.shield=t.physics.add.sprite(this.x,this.y,"shield-fly"),this.shield.body.setAllowGravity(!1),this.shield.setScale(.4),this.shield.setVisible(!1),this.shield.on("animationcomplete-fly",((t,e)=>{"fly"===t.key&&(this.scene.fightEnds=!0)}))}createAnimations(){this.scene.anims.create({key:"idle",frames:this.scene.anims.generateFrameNumbers("captain-idle",{start:0,end:6}),frameRate:12,repeat:-1}),this.scene.anims.create({key:"run",frames:this.scene.anims.generateFrameNumbers("captain-run",{start:0,end:9}),frameRate:12,repeat:-1}),this.scene.anims.create({key:"punch",frames:this.scene.anims.generateFrameNumbers("captain-fight",{start:1,end:3}),frameRate:12,repeat:0}),this.scene.anims.create({key:"kick",frames:this.scene.anims.generateFrameNumbers("captain-fight",{start:4,end:7}),frameRate:12,repeat:0}),this.scene.anims.create({key:"shield",frames:this.scene.anims.generateFrameNumbers("captain-fight",{start:8,end:11}),frameRate:12,repeat:0}),this.scene.anims.create({key:"throw",frames:this.scene.anims.generateFrameNumbers("shield-throw",{start:0,end:5}),frameRate:12,repeat:0}),this.scene.anims.create({key:"catch",frames:this.scene.anims.generateFrameNumbers("shield-throw",{start:12,end:15}),frameRate:12,repeat:0}),this.scene.anims.create({key:"fly",frames:this.scene.anims.generateFrameNumbers("shield-fly",{start:0,end:7}),frameRate:12,repeat:0}),this.scene.anims.createFromAseprite("shot");let t=["punch","punch2","kick","shield","fly","catch","burst","jumpKick"];this.sprite.on("animationcomplete",((e,s)=>{t.includes(e.key)&&(this.scene.fightEnds=!0)}))}}class a{constructor(t){this.scene=t,this.cursors=t.input.keyboard.createCursorKeys(),this.wKey=t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),this.aKey=t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),this.sKey=t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),this.dKey=t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),this.qKey=t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),this.eKey=t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),this.fKey=t.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),this.buttons={A:!1,B:!1,X:!1,Y:!1},this.isMobile=!0,this.isMobile=this.isMobileDevice()||this.isTouchDevice(),this.isMobile&&(this.scene.game.scene.start("UIScene",{inputHandler:this}),this.resizeGame({width:this.scene.scale.width,height:this.scene.scale.height}),this.scene.scale.updateCenter())}isFightActionPressed(){return this.qKey.isDown||this.eKey.isDown||this.fKey.isDown||this.cursors.space.isDown||this.buttons.A||this.buttons.B||this.buttons.X||this.buttons.Y}isFightActionLeaved(){return this.cursors.space.isUp&&this.qKey.isUp&&this.fKey.isUp&&this.eKey.isUp&&!this.buttons.A&&!this.buttons.B&&!this.buttons.X&&!this.buttons.Y}isJumpKeyPressed(){var t;return this.cursors.up.isDown||this.wKey.isDown||(null==(t=this.joystickKeys)?void 0:t.up.isDown)}isMobileDevice(){const t=navigator.userAgent||navigator.vendor||window.opera;return/android/i.test(t)||/iPad|iPhone|iPod/.test(t)&&!window.MSStream}isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0}resizeGame({width:t,height:e}){const s=4/3;let i,r,n;t/e>s?(r=e,i=e*s):(i=t,r=t/s),n=Math.min(i/this.scene.game.config.width,r/this.scene.game.config.height),this.scene.cameras.main.setZoom(n),this.scene.cameras.main.setViewport((t-i)/2,(e-r)/2,i,r),this.scene.cameras.main.setBounds(0,0,this.scene.game.config.width,this.scene.game.config.height)}setButtonState(t,e){this.buttons[t]=e}setJoystickCursor(t){const e=this.scene.plugins.get("rexVirtualJoystick");e?(this.joystick=e.add(this.scene,t),this.joystickKeys=this.joystick.createCursorKeys()):console.error("Plugin rexVirtualJoystick no encontrado")}}class o extends Phaser.Physics.Arcade.Sprite{constructor(t,e,s){super(t,e,s,"bullet"),this.scene=t,this.scene.physics.world.enable(this),this.scene.add.existing(this),this.setCollideWorldBounds(!0),this.on("animationcomplete",this.animationComplete,this)}fire(t,e,s){this.bulletFlash(t,e),this.body.reset(t,e),this.body.setAllowGravity(!1),this.setActive(!0),this.setVisible(!0);let i="right"==s?1:-1;this.setVelocityX(1e3*i)}update(){this.y<0&&(this.setActive(!1),this.setVisible(!1))}animationComplete(t,e){this.destroy()}bulletFlash(t,e){let s=this.scene.add.graphics();s.fillStyle(16777215,1),s.fillCircle(t,e,15),s.postFX.addBloom(16777215,1,1,1,2),this.scene.tweens.add({targets:s,x:t,y:e,scale:0,opacity:0,duration:100,onComplete:()=>{s.destroy()}})}}class d extends s.Scene{constructor(){super("Game"),e(this,"player"),e(this,"inputHandler"),e(this,"score",0),e(this,"textScore"),e(this,"lives",3),e(this,"textLives"),e(this,"gameOver",!1),e(this,"map"),e(this,"movingDirection","right"),e(this,"focusTo","right"),e(this,"blockedFight",!1),e(this,"fightEnds",!0),e(this,"shieldThrown",!1),e(this,"shieldCached",!0),e(this,"enemy"),e(this,"bulletFired",!1)}create(){this.addBackground(),this.gameOver=!1,this.player=new h(this,100,400,"captain-idle"),this.inputHandler=new a(this),this.showGuideText(),console.log("game scene",this),this.bullets=this.physics.add.group({classType:o,runChildUpdate:!0}),this.createEnemy(),this.playMusic(),this.createCamera()}update(){if(0==this.player.sprite.body.velocity.x&&(this.movingDirection="none"),this.player.sprite.body.velocity.y>0&&(this.movingDirection="down",this.inputHandler.isFightActionPressed()&&!this.blockedFight&&(this.fightEnds=!1,this.blockedFight=!0,this.player.sprite.anims.play("jumpKick"))),this.inputHandler.isFightActionLeaved()&&(this.blockedFight=!1),this.inputHandler.isFightActionPressed()&&!this.blockedFight&&this.handleFightActions(),this.fightEnds&&this.handleMovement(),this.inputHandler.isJumpKeyPressed()&&this.player.sprite.body.blocked.down&&this.handleJump(),this.gameOver&&this.scene.start("GameOver"),"burst"===this.player.sprite.anims.currentAnim.key){let t=this.player.sprite.anims.currentFrame;t.index>=3&&t.index%2==1?this.bulletFired||(this.fireBullet(this),this.bulletFired=!0):this.bulletFired=!1}else this.bulletFired=!1}handleJump(){this.movingDirection="up",this.player.sprite.setVelocityY(-550),this.player.sprite.body.setGravityY(600),this.player.sprite.anims.play("jump")}handleFightActions(){let t=this.sound.add("punch");this.inputHandler.qKey.isDown||this.inputHandler.buttons.A?(this.blockedFight=!0,this.fightEnds=!1,this.player.sprite.anims.play("burst",!0)):this.inputHandler.eKey.isDown||this.inputHandler.buttons.B?(this.blockedFight=!0,this.fightEnds=!1,this.player.sprite.anims.play("kick",!0),t.play()):this.inputHandler.fKey.isDown||this.inputHandler.buttons.Y?(this.blockedFight=!0,this.fightEnds=!1,this.shieldCached&&!this.shieldThrown&&(this.shieldThrown=!0,this.throwShield())):(this.inputHandler.cursors.space.isDown||this.inputHandler.buttons.X)&&(this.blockedFight=!0,this.fightEnds=!1,this.player.sprite.anims.play("shield",!0),this.time.delayedCall(100,(()=>{t.play()})))}fireBullet(t){let e=this.sound.add("laser");e.setVolume(.4);let s="right"==this.focusTo?.5*this.player.sprite.body.width:-.5*this.player.sprite.body.width,i=t.player.sprite.x+s,r=t.bullets.get(i,t.player.sprite.y);r?(r.fire(i,t.player.sprite.y,this.focusTo),e.play()):console.log("No hay balas disponibles")}handleMovement(){var t,e;this.inputHandler.cursors.left.isDown||this.inputHandler.aKey.isDown||(null==(t=this.inputHandler.joystickKeys)?void 0:t.left.isDown)?(this.movingDirection="left",this.focusTo="left",this.player.sprite.setVelocityX(-200),this.player.sprite.anims.play("run",!0).setFlipX(!0),this.moveBackground(-1)):this.inputHandler.cursors.right.isDown||this.inputHandler.dKey.isDown||(null==(e=this.inputHandler.joystickKeys)?void 0:e.right.isDown)?(this.movingDirection="right",this.focusTo="right",this.player.sprite.setVelocityX(200),this.player.sprite.anims.play("run",!0).setFlipX(!1),this.moveBackground(1)):(this.player.sprite.setVelocityX(0),this.player.sprite.anims.play("idle",!0))}throwShield(){let t=this.sound.add("boomerang");this.time.delayedCall(400,(()=>{t.play()})),this.player.sprite.anims.play("throw",!0),this.time.delayedCall(375,(()=>{let t={x:"right"==this.focusTo?this.player.sprite.x+this.player.sprite.body.width/2:this.player.sprite.x-this.player.sprite.body.width/2,y:this.player.sprite.y};this.player.shield.setPosition(t.x,t.y),this.player.shield.setVisible(!0),this.player.shield.play("fly",!0);let e="right"==this.focusTo?t.x+300:t.x-300;this.tweens.add({targets:this.player.shield,x:e,y:t.y,duration:333,ease:"Power1",onComplete:()=>{this.flyBackTween()}})}))}flyBackTween(){this.tweens.add({targets:this.player.shield,x:this.player.sprite.x,y:this.player.sprite.y,duration:333,ease:"Power1",onComplete:()=>{this.player.shield.setVisible(!1),this.shieldThrown=!1,this.shieldCached=!0,this.player.sprite.anims.play("catch",!0)}})}destroyEnemy(t,e){let s=this.sound.add("die");s.setVolume(.4),e.destroy(),s.play(),this.createEnemy()}createEnemy(){let t=this.player.sprite.x<this.game.config.width/2?this.game.config.width-50:50;this.enemy=this.add.rectangle(t,this.game.config.height-50,50,50,65280),this.physics.add.existing(this.enemy),this.enemy.body.setCollideWorldBounds(!0),this.physics.add.collider(this.player.shield,this.enemy,this.destroyEnemy,null,this),this.physics.add.collider(this.player.sprite,this.enemy,this.handleBodyCollision,null,this),this.physics.add.collider(this.bullets,this.enemy,this.handleBulletCollision,null,this)}handleBodyCollision(t,e){const s=t.anims.currentAnim.key;"punch"!==s&&"kick"!==s&&"shield"!==s||this.destroyEnemy(null,e)}showGuideText(){let t={fontFamily:"Arial Black",fontSize:15,color:"#000000",align:"center"};this.add.text(20,20,"WSAD or arrow keys to move",t),this.add.text(20,40,"Q key for punch",t),this.add.text(20,60,"E key for kick",t),this.add.text(20,80,"SPACE key for shield attack",t),this.add.text(20,100,"F key for shield throw",t)}handleBulletCollision(t,e){this.destroyEnemy(null,e),t.destroy()}playMusic(){let t=this.sound.add("bitest");t.play(),t.setLoop(!0)}addBackground(){this.bg=this.add.tileSprite(0,0,800,600,"bg").setOrigin(0,0),this.farBuildings=this.add.tileSprite(0,0,800,600,"farBuildings").setOrigin(0,0),this.buildings=this.add.tileSprite(0,100,800,600,"buildings").setOrigin(0,0),this.foreground=this.add.tileSprite(0,0,800,600,"foreground").setOrigin(0,0)}moveBackground(t){this.bg.tilePositionX+=.2*t,this.farBuildings.tilePositionX+=.5*t,this.buildings.tilePositionX+=1*t,this.foreground.tilePositionX+=2*t}createCamera(){this.cameras.main.setBounds(0,0,800,600),this.physics.world.setBounds(0,0,800,600),this.cameras.main.setSize(800,600),this.cameras.main.startFollow(this.player.sprite,!0,.5,0,200,0),this.cameras.main.setFollowOffset(-200,0)}}class l extends Phaser.Scene{constructor(){super({key:"UIScene",transparent:!0}),this.width,this.height,this.isPortrait}init(t){this.inputHandler=t.inputHandler}create(){console.log("UI scene",this),this.width=this.scale.parentSize.width,this.height=this.scale.parentSize.height,this.isPortrait=this.width<this.height,console.log("parent size",this.width,this.height),this.scale.setGameSize(this.width,this.height),this.addVirtualJoystick(),this.addVirtualButtons()}addVirtualJoystick(){const t=this.isPortrait?.06*this.width:.1*this.width,e=this.isPortrait?(this.width-2*t)/4:100,s=this.isPortrait?e+t:e+t/4,i=this.height-e-t,r={x:s,y:i,radius:e,base:this.add.circle(s,i,e,8947848).setAlpha(.5),thumb:this.add.circle(s,i,e/2,13421772).setAlpha(.8),dir:"8dir",fixed:!0,enable:!0};this.inputHandler.setJoystickCursor(r)}addVirtualButtons(){const t=Math.min(30,.06*this.width),e={x:this.width-4*t,y:this.isPortrait?this.height-5*t:this.height/2+2*t};[{key:"A",x:e.x,y:e.y+2*t},{key:"B",x:e.x+2*t,y:e.y},{key:"X",x:e.x-2*t,y:e.y},{key:"Y",x:e.x,y:e.y-2*t}].forEach((e=>{this.add.circle(e.x,e.y,t).setStrokeStyle(2,16711680).setInteractive().on("pointerdown",(()=>{this.inputHandler.setButtonState(e.key,!0)})).on("pointerup",(()=>{this.inputHandler.setButtonState(e.key,!1)})),this.add.text(e.x,e.y,e.key,{fontFamily:"Arial Black",fontSize:20,color:"#ffffff",align:"center"}).setOrigin(.5)}))}handleResize(t){t.width,t.height,this.scene.restart()}}class c extends s.Scene{constructor(){super("GameOver")}create(){this.cameras.main.setBackgroundColor(16711680),this.add.image(this.game.config.width/2,this.game.config.height/2,"background").setAlpha(.5),this.add.text(this.game.config.width/2,this.game.config.height/2,"Game Over",{fontFamily:"Arial Black",fontSize:64,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.input.once("pointerdown",(()=>{this.scene.start("MainMenu")}))}}const u=Phaser.Input.Keyboard.Key,y=Phaser.Input.Keyboard.KeyCodes;class p{constructor(t){this.cursorKeys={up:new u(t,y.UP),down:new u(t,y.DOWN),left:new u(t,y.LEFT),right:new u(t,y.RIGHT)},this.noKeyDown=!0}shutdown(t){for(var e in this.cursorKeys)this.cursorKeys[e].destroy();this.cursorKeys=void 0}destroy(t){shutdown(t)}createCursorKeys(){return this.cursorKeys}setKeyState(t,e){var s=this.cursorKeys[t];return s.enabled?(e&&(this.noKeyDown=!1),s.isDown!==e&&(m.timeStamp=Date.now(),m.keyCode=s.keyCode,e?s.onDown(m):s.onUp(m)),this):this}clearAllKeysState(){for(var t in this.noKeyDown=!0,this.cursorKeys)this.setKeyState(t,!1);return this}getKeyState(t){return this.cursorKeys[t]}get upKeyDown(){return this.cursorKeys.up.isDown}get downKeyDown(){return this.cursorKeys.down.isDown}get leftKeyDown(){return this.cursorKeys.left.isDown}get rightKeyDown(){return this.cursorKeys.right.isDown}get anyKeyDown(){return!this.noKeyDown}}var m={timeStamp:0,keyCode:0,altKey:!1,ctrlKey:!1,shiftKey:!1,metaKey:!1,location:0},g=180/Math.PI;const b={"up&down":0,"left&right":1,"4dir":2,"8dir":3};var f={};const v=Phaser.Utils.Objects.GetValue,w=Phaser.Math.Distance.Between,K=Phaser.Math.Angle.Between;class k extends p{constructor(t,e){super(t),this.resetFromJSON(e)}resetFromJSON(t){null==this.start&&(this.start={x:0,y:0}),null==this.end&&(this.end={x:0,y:0}),this._enable=void 0,this.setEnable(v(t,"enable",!0)),this.setMode(v(t,"dir","8dir")),this.setDistanceThreshold(v(t,"forceMin",16));var e=v(t,"start.x",null),s=v(t,"start.y",null),i=v(t,"end.x",null),r=v(t,"end.y",null);return this.setVector(e,s,i,r),this}toJSON(){return{enable:this.enable,dir:this.dirMode,forceMin:this.forceMin,start:{x:this.start.x,y:this.start.y},end:{x:this.end.x,y:this.end.y}}}setMode(t){return"string"==typeof t&&(t=b[t]),this.dirMode=t,this}get enable(){return this._enable}set enable(t){if(this._enable!==t)return t||this.clearVector(),this._enable=t,this}setEnable(t){return void 0===t&&(t=!0),this.enable=t,this}toggleEnable(){return this.setEnable(!this.enable),this}setDistanceThreshold(t){return t<0&&(t=0),this.forceMin=t,this}clearVector(){return this.start.x=0,this.start.y=0,this.end.x=0,this.end.y=0,this.clearAllKeysState(),this}setVector(t,e,s,i){if(!this.enable)return this;if(null===t)return this.clearVector(),this;if(void 0===s&&(s=t,t=0,i=e,e=0),this.start.x=t,this.start.y=e,this.end.x=s,this.end.y=i,this.forceMin>0&&this.force<this.forceMin)return this.clearVector(),this;this.noKeyDown=!0;var r=function(t,e,s){switch(void 0===s?s={}:!0===s&&(s=f),s.left=!1,s.right=!1,s.up=!1,s.down=!1,t=(t+360)%360,e){case 0:t<180?s.down=!0:s.up=!0;break;case 1:t>90&&t<=270?s.left=!0:s.right=!0;break;case 2:t>45&&t<=135?s.down=!0:t>135&&t<=225?s.left=!0:t>225&&t<=315?s.up=!0:s.right=!0;break;case 3:t>22.5&&t<=67.5?(s.down=!0,s.right=!0):t>67.5&&t<=112.5?s.down=!0:t>112.5&&t<=157.5?(s.down=!0,s.left=!0):t>157.5&&t<=202.5?s.left=!0:t>202.5&&t<=247.5?(s.left=!0,s.up=!0):t>247.5&&t<=292.5?s.up=!0:t>292.5&&t<=337.5?(s.up=!0,s.right=!0):s.right=!0}return s}(this.angle,this.dirMode,!0);for(var n in r)this.setKeyState(n,r[n]);return this}get forceX(){return this.end.x-this.start.x}get forceY(){return this.end.y-this.start.y}get force(){return w(this.start.x,this.start.y,this.end.x,this.end.y)}get rotation(){return K(this.start.x,this.start.y,this.end.x,this.end.y)}get angle(){return this.rotation*g}get octant(){var t=0;return this.rightKeyDown?t=this.downKeyDown?45:0:this.downKeyDown?t=this.leftKeyDown?135:90:this.leftKeyDown?t=this.upKeyDown?225:180:this.upKeyDown&&(t=this.rightKeyDown?315:270),t}}const E={setEventEmitter(t,e){return void 0===e&&(e=Phaser.Events.EventEmitter),this._privateEE=!0===t||void 0===t,this._eventEmitter=this._privateEE?new e:t,this},destroyEventEmitter(){return this._eventEmitter&&this._privateEE&&this._eventEmitter.shutdown(),this},getEventEmitter(){return this._eventEmitter},on(){return this._eventEmitter&&this._eventEmitter.on.apply(this._eventEmitter,arguments),this},once(){return this._eventEmitter&&this._eventEmitter.once.apply(this._eventEmitter,arguments),this},off(){return this._eventEmitter&&this._eventEmitter.off.apply(this._eventEmitter,arguments),this},emit(t){return this._eventEmitter&&t&&this._eventEmitter.emit.apply(this._eventEmitter,arguments),this},addListener(){return this._eventEmitter&&this._eventEmitter.addListener.apply(this._eventEmitter,arguments),this},removeListener(){return this._eventEmitter&&this._eventEmitter.removeListener.apply(this._eventEmitter,arguments),this},removeAllListeners(){return this._eventEmitter&&this._eventEmitter.removeAllListeners.apply(this._eventEmitter,arguments),this},listenerCount(){return this._eventEmitter?this._eventEmitter.listenerCount.apply(this._eventEmitter,arguments):0},listeners(){return this._eventEmitter?this._eventEmitter.listeners.apply(this._eventEmitter,arguments):[]},eventNames(){return this._eventEmitter?this._eventEmitter.eventNames.apply(this._eventEmitter,arguments):[]}};var x={};const C=Phaser.Utils.Objects.GetValue,D=Phaser.Geom.Circle,S=Phaser.Geom.Circle.Contains;class P extends k{constructor(t,e){var s=t.scene;super(s,e);var i=C(e,"eventEmitter",void 0),r=C(e,"EventEmitterClass",void 0);this.setEventEmitter(i,r),this.scene=s,this.mainCamera=s.sys.cameras.main,this.pointer=void 0,this.gameObject=t,this.radius=C(e,"radius",100),t.setInteractive(new D(t.displayOriginX,t.displayOriginY,this.radius),S),this.boot()}resetFromJSON(t){return super.resetFromJSON(t),this.pointer=void 0,this}toJSON(){var t=super.toJSON();return t.radius=this.radius,t}boot(){this.gameObject.on("pointerdown",this.onKeyDownStart,this),this.gameObject.on("pointerover",this.onKeyDownStart,this),this.scene.input.on("pointermove",this.onKeyDown,this),this.scene.input.on("pointerup",this.onKeyUp,this),this.gameObject.once("destroy",this.onParentDestroy,this)}shutdown(t){this.scene&&(this.scene.input.off("pointermove",this.onKeyDown,this),this.scene.input.off("pointerup",this.onKeyUp,this),this.destroyEventEmitter(),this.scene=void 0,this.mainCamera=void 0,this.pointer=void 0,this.gameObject=void 0,super.shutdown())}get enable(){return this._enable}set enable(t){if(this._enable!==t)return t||(this.pointer=void 0),super.enable=t,this}destroy(t){this.shutdown(t)}onParentDestroy(t,e){this.destroy(e)}onKeyDownStart(t){t.isDown&&void 0===this.pointer&&(this.pointer=t,this.onKeyDown(t),this.emit("pointerdown",t))}onKeyDown(t){if(this.pointer===t){var e=function(t,e,s){var i=t.camera;return i?(void 0===s?s={}:!0===s&&(s=x),i===e?(s.x=t.worldX,s.y=t.worldY):i.getWorldPoint(t.x,t.y,s),s):null}(t,this.mainCamera,!0);if(e){var s=t.camera,i=this.gameObject,r=i.x,n=i.y;0===i.scrollFactorX&&(r+=s.scrollX),0===i.scrollFactorY&&(n+=s.scrollY),this.setVector(r,n,e.x,e.y),this.end.x=e.x,this.end.y=e.y,this.emit("update")}}}onKeyUp(t){this.pointer===t&&(this.pointer=void 0,this.clearVector(),this.emit("update"),this.emit("pointerup",t))}forceUpdate(){var t=this.pointer;return t&&t.isDown?(this.onKeyDown(t),this):this}}Object.assign(P.prototype,E);const F=Phaser.Utils.Objects.GetValue;class _{constructor(t,e){void 0===e&&(e={});var s=F(e,"eventEmitter",void 0),i=F(e,"EventEmitterClass",void 0);this.setEventEmitter(s,i),e.eventEmitter=this.getEventEmitter(),this.scene=t,this.base=void 0,this.thumb=void 0,this.touchCursor=void 0,this.setRadius(F(e,"radius",100)),this.addBase(F(e,"base",void 0),e),this.addThumb(F(e,"thumb",void 0));var r=F(e,"x",0),n=F(e,"y",0);this.base.setPosition(r,n),this.thumb.setPosition(r,n),F(e,"fixed",!0)&&this.setScrollFactor(0),this.boot()}destroy(){this.destroyEventEmitter(),this.base.destroy(),this.thumb.destroy(),this.scene=void 0,this.base=void 0,this.thumb=void 0,this.touchCursor=void 0}createCursorKeys(){return this.touchCursor.createCursorKeys()}get forceX(){return this.touchCursor.forceX}get forceY(){return this.touchCursor.forceY}get force(){return this.touchCursor.force}get rotation(){return this.touchCursor.rotation}get angle(){return this.touchCursor.angle}get up(){return this.touchCursor.upKeyDown}get down(){return this.touchCursor.downKeyDown}get left(){return this.touchCursor.leftKeyDown}get right(){return this.touchCursor.rightKeyDown}get noKey(){return this.touchCursor.noKeyDown}get pointerX(){return this.touchCursor.end.x}get pointerY(){return this.touchCursor.end.y}get pointer(){return this.touchCursor.pointer}setPosition(t,e){return this.x===t&&this.y===e||(this.x=t,this.y=e,this.forceUpdateThumb()),this}set x(t){this.x!==t&&(this.base.x=t,this.thumb.x=t)}set y(t){this.y!==t&&(this.base.y=t,this.thumb.y=t)}get x(){return this.base.x}get y(){return this.base.y}setVisible(t){return this.visible=t,this}toggleVisible(){return this.visible=!this.visible,this}get visible(){return this.base.visible}set visible(t){this.base.visible=t,this.thumb.visible=t,this.enable=t}get enable(){return this.touchCursor.enable}set enable(t){this.touchCursor.setEnable(t)}setEnable(t){return void 0===t&&(t=!0),this.enable=t,this}toggleEnable(){return this.setEnable(!this.enable),this}setRadius(t){return this.radius=t,this}addBase(t,e){return this.base&&this.base.destroy(),void 0===t&&(t=this.scene.add.circle(0,0,this.radius).setStrokeStyle(3,255)),void 0===e&&(e={}),e.eventEmitter=this.getEventEmitter(),this.touchCursor=new P(t,e),this.base=t,this}addThumb(t){return this.thumb&&this.thumb.destroy(),void 0===t&&(t=this.scene.add.circle(0,0,40).setStrokeStyle(3,65280)),this.thumb=t,this}setScrollFactor(t){return this.base.setScrollFactor(t),this.thumb.setScrollFactor(t),this}boot(){this.on("update",this.update,this)}update(){var t,e,s=this.touchCursor,i=s.dirMode;if(s.anyKeyDown)if(s.force>this.radius){var r=s.rotation;t=0!==i?Math.cos(r)*this.radius:0,e=1!==i?Math.sin(r)*this.radius:0}else t=0!==i?s.forceX:0,e=1!==i?s.forceY:0;else t=0,e=0;return this.thumb.x=this.base.x+t,this.thumb.y=this.base.y+e,this}forceUpdateThumb(){return this.touchCursor.forceUpdate(),this}}Object.assign(_.prototype,E);class B extends Phaser.Plugins.BasePlugin{constructor(t){super(t)}start(){this.game.events.on("destroy",this.destroy,this)}add(t,e){return new _(t,e)}addVectorToCursorKeys(t){return new k(void 0,t)}}const A={type:Phaser.AUTO,width:800,height:600,parent:"game-container",fullscreenTarget:"game-container",scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},pixelArt:!0,physics:{default:"arcade",arcade:{gravity:{y:500}}},scene:[i,r,n,d,l,c],plugins:{global:[{key:"rexVirtualJoystick",plugin:B,start:!0}]}};new Phaser.Game(A);
