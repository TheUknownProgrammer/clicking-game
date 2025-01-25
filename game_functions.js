
const InfoGame = document.getElementById("InfoGame")
const sub = document.getElementById("textSub")

const amount_clicks = document.querySelector(".amount_clicks")
const ReachPoint = document.querySelector(".reach-point");
const winMessage = document.getElementById("winMessage")

const win_sound = new Audio('audios/SFX/Win_Game.mp3');

document.getElementById("customize").style.backgroundColor = RandomColor();

const BtnContainer = document.getElementById("buttons_difficulties");
const BtnDifficulties = BtnContainer.getElementsByTagName("button");
const CustomizeField = document.querySelector(".Customize-Container");
const stop_music_bth = document.querySelector(".disable_music_bth");
stop_music_bth.onclick = audioStop;
const disableTimer = document.querySelector(".disable_timer");
const settings_bth = document.querySelector(".settings_bth");
settings_bth.onclick = settings;
const settings_back = document.querySelector(".settings_bth_back");
settings_back.onclick = settings;
const settings_menu = document.querySelector(".settings_menu");
const main = document.querySelector("main")
const h1 = document.querySelector("h1");
const body = document.querySelector("body");
let BtnGame = document.getElementById("BtnGame")
BtnGame.addEventListener("click", increment);
const text = document.getElementById("text_on_game")
const menu_back_bth = document.querySelector(".EndingBtns #menu_back");
const RestartBtn = document.querySelector(".RestartBtn");
const EndingBtns = document.querySelector(".EndingBtns");
const Timeout = document.getElementById("TimeoutMsg")
const TimerEl = document.querySelector(".TimerRunning");
const loop_select = document.querySelector(".loop_select");
const check_loop = document.getElementById("check_loop");

const mobile_device = /Android|webos|iphone|ipad|BlackBerry|IEMobile|Opera Mini|nokia|Samsung/i.test(window.navigator.userAgent) || false;
if (mobile_device) {
  const div = document.createElement("div");
  div.classList.add("click-area");
  div.addEventListener("click", click_effect);
  BtnGame.parentNode.replaceChild(div, BtnGame);
  box_click = document.querySelector(".click-area");
}

var cps = 0;
var ms = 0;
let music_active = true;
let timer_bool = true;
let CustomizeGamemode = false;
let count = 0;
let Hover = '';
const NoneHover = "(difficulty mode)";
var GameHasStart = false;
var win = false;
let currentGProperties = { timeValue: null, CurrentMusic: null, max: null, gamemode: null };
var TimerFor;
var TimerRun;
var CpsCheck;

const musics = {
  Easy: new Audio("audios/musics/Delightful_D.mp3"),
  Medium: new Audio("audios/musics/Kevin_MacLeod_-_Overworld__8-bit__2016__Royalty_Free__Free_Download.mp3"),
  Hard: new Audio("audios/musics/Kevin_MacLeod__MTA.mp3"),
  Random: new Audio("audios/musics/Kero_Kero_Bonito_-_Id_Rather_Sleep.mp3"),
  Challenge: new Audio("audios/musics/~EnV~Heaven Rd. 2 trim.MP3"),
  Impossible: new Audio("audios/musics/yatagarasu.mp3"),
  menu: {
    Settings: new Audio("audios/musics/my music.mp3"),
    Customize: new Audio("audios/musics/music by me for customize menu.mp3")
  }
}

for (let index in musics) {
  musics[index].loop = true;
}
for (let index in musics.menu) {
  musics.menu[index].loop = true;
}

const GameModes = {
  Easy: {
    ForWin: 20,
    music: musics.Easy,
    timer: 10,
    link: "https://www.youtube.com/watch?v=7uBohM8hlds&list=PLUN6QxEqa35UYDaNLlnZ7UMiIsY--mHXm",
    isActive: false
  },
  Medium: {
    ForWin: 50,
    music: musics.Medium,
    timer: 15,
    isActive: false,
    link: "https://www.youtube.com/watch?v=d5FVNxdZkfA"
  },
  Hard: {
    ForWin: 100,
    music: musics.Hard,
    timer: 20,
    link: "https://www.youtube.com/watch?v=uJUEKKRWKsI&list=PLUN6QxEqa35UYDaNLlnZ7UMiIsY--mHXm&index=4",
    isActive: false
  },
  Random: {
    ForWin: "?",
    music: musics.Random,
    timer: null,
    link: "https://www.youtube.com/watch?v=c4j9Z9bwBBU",
    isActive: false
  },
  Challenge: {
    ForWin: 50,
    music: musics.Challenge,
    timer: 5,
    link: "https://www.youtube.com/watch?v=5-Wn1sO720k",
    isActive: false
  },
  Impossible: {
    ForWin: 1000,
    music: musics.Impossible,
    timer: 145, // 140
    isActive: false,
    link: "https://www.youtube.com/watch?v=ag1ayovdaxc",
    special: function () {
      main.style.backgroundImage = "linear-gradient(black,red)";
      body.style.color = "red";
      document.getElementById("text_on_game").style.backgroundColor = "white";
    }
  },
  customize: {
    isActive: false,
    ForWin: "x times",
    timer: null
  }
}
Object.freeze(GameModes);
Object.freeze(musics);

WinStatus();

function RandomColor() {
  let rgb1 = Math.floor(Math.random() * 256);
  let rgb2 = Math.floor(Math.random() * 256);
  let rgb3 = Math.floor(Math.random() * 256);

  var Color = `rgb(${rgb1},${rgb2},${rgb3})`;
  return Color;
}

function ScreenSize() {
  let width_screen = window.innerWidth;
  let height_screen = window.innerHeight;
  console.log("%cscreen width: " + width_screen + " | screen height: " + height_screen, "background-color: purple; color: white; padding: 3.75px; border: 1.5px solid dimgray; border-radius: 2.5px; font-family: verdana; text-shadow: 3px 3px 3px dimgray; text-transform: capitalize;");
}

function ShowInfo() {
  var gamemode = this.id;
  ShowTXTLIMIT(GameModes[gamemode].ForWin, GameModes[gamemode].timer);

  function ShowTXTLIMIT(info_mode, Timer) {
    Hover = info_mode;
    currentGProperties.timeValue = Timer;
    if (timer_bool && Timer != null) {
      InfoGame.innerHTML = `${info_mode} times in ${Timer} seconds`;
    }
    else if (typeof (info_mode) !== "string") {
      InfoGame.innerHTML = `${info_mode} times`;
    }
    else {
      InfoGame.innerHTML = info_mode;
    }
  }
}
for (let i = 0; i < BtnDifficulties.length; i++) {
  BtnDifficulties[i].onmousemove = ShowInfo;
}

function ProcessDiff(Clicks, Time, music, game_mode) {
  if (music_active == true && music != null) {
    music.play();
    console.log(`%clink to the music of ${Clicks == 20 ? "easy" : Clicks == 50 ? "medium" : Clicks == 100 ? "hard" : Clicks == 1000 ? "impossible" : "Random"} gamemode difficulty ↓ \n link: ${music}!`, "background-color: rgb(240,240,240); padding: 5px; text-transform: capitalize; font-family: Lucida Sans;");
  }
  console.log(GameModes[game_mode])
  if (GameModes[game_mode].hasOwnProperty("special")) {
    GameModes[game_mode].special();
  }

  if (timer_bool && Time != null) {
    var TimeGame = Time;
    let Seconds = (Time * 1000);

    TimerRun = setInterval(() => {
      TimeGame--;
      TimerEl.textContent = TimeGame;
    }, 1000);

    TimerFor = setTimeout(function () {
      if (!win || Time <= 0) {
        StopCPScheck();
        StopTimer();
        audioStop();
        Timeout.style.display = "block";
        DisplayGame("none");
        menu_back_bth.style.display = "block";
      }
    }, Seconds);
  }
  currentGProperties.CurrentMusic = music;
  currentGProperties.gamemode = game_mode;
  currentGProperties.timeValue = Time;
  currentGProperties.max = Clicks;

  startGame();
}

Random.onclick = () => {
  let Random = Math.floor(Math.random() * 81) + 20;
  ProcessDiff(Random, null, musics.Random, "Random");
}

Challenge.onclick = () => {
  ProcessDiff(GameModes.Challenge.ForWin, GameModes.Challenge.timer, musics.Challenge, "Challenge");
}

customize.onclick = () => {
  musics.menu.Customize.play();
  CustomizeField.style.display = "block";
  sub.style.display = "none";
  BtnContainer.style.display = "none";
}

for (let i = 0; i < BtnDifficulties.length - 3; i++) {
  console.log(BtnDifficulties[i]);
  BtnDifficulties[i].addEventListener("click", EnterGamemode);
}

function EnterGamemode() {
  ProcessDiff(GameModes[this.id].ForWin, GameModes[this.id].timer, musics[this.id], this.id);
}

function startGame() {
  HideDiffculty();
  GameHasStart = true;
  console.log(`GameHasStart = ${GameHasStart}`);
  DisplayGame("block");
  console.table(GameModes);
  console.log(`%crequired amount of clicks to win: ${currentGProperties.max}`, "color: blue; text-transform: uppercase; font-family: calibri; font-size: 17px;");
  ReachPoint.textContent = currentGProperties.max;

  if (settings_menu.style.display == "block") {
    settings_OFF();
  }

  CpsCheck = setInterval(() => {
    ms += 10;
    cps = (count / (ms / 1000)).toFixed(1);
    console.log(`Player CPS: ${cps}`);
    if (cps > 18) {
      document.location.reload();
    }
  }, 10);

  settings_bth.style.display = "none";
}

function increment() {
  count++;
  amount_clicks.innerHTML = count;
  console.log(`%cclick number: ${count}`, "color: black; font-family: arial;");

  amount_clicks.classList.add("effect_click_times");
  setTimeout(() => {
    amount_clicks.classList.remove("effect_click_times");
  }, 225);

  if (count >= currentGProperties.max) {
    win = true;
    WinFunction();
  }

}

let StopTimer = () => { clearInterval(TimerRun); clearTimeout(TimerFor); }
let StopCPScheck = () => { clearInterval(CpsCheck); cps = 0; ms = 0; };

function settings() {
  if (settings_menu.style.display == "block") {
    settings_OFF();
    console.log(`%c ${settings_OFF}`, "color: red; font-family: verdana;");
  }
  else {
    settings_ON();
    console.log(`%c ${settings_ON}`, "color: green; font-family: verdana;");
  }
}
function settings_OFF() {
  musics.menu.Settings.pause();
  if (CustomizeField.style.display == "block") {
    musics.menu.Customize.play();
  }
  musics.menu.Settings.currentTime = 0;
  settings_menu.style.display = "none";
  body.style.backgroundColor = "rgba(240,240,240)";
  stop_music_bth.style.display = "none";
  settings_bth.style.display = "block";
  main.style.opacity = "1";

  for (let i = 0; i < BtnDifficulties.length; i++) {
    BtnDifficulties[i].disabled = false;
  }

}
function settings_ON() {
  musics.menu.Settings.play();
  if (CustomizeField.style.display == "block") {
    musics.menu.Customize.pause();
  }
  settings_menu.style.display = "block";
  body.style.backgroundColor = "rgba(105,105,105,0.7)";
  stop_music_bth.style.display = "block";
  settings_bth.style.display = "none";
  main.style.opacity = "0.7";

  for (let i = 0; i < BtnDifficulties.length; i++) {
    BtnDifficulties[i].disabled = true;
  }

}
stop_music_bth.onclick = function () {
  if (music_active) {
    this.innerHTML = "enable music";
    this.title = "click to enable music in game";
    console.log("%cMusic Disable", "color: red; font-family: cursive; font-size: 14px;");
    music_active = false;
    console.log(`%cmusic active boolean: ${music_active} | the music is disable now.`, "color: red; font-family: cursive; font-size: 14px;");
  }
  else {
    this.innerHTML = "disable music";
    this.title = "click to disable music in game";
    console.log("%cMusic Enable", "color: green; font-family: cursive; font-size: 14px;");
    music_active = true;
    console.log(`%cmusic active boolean: ${music_active} | the music is enable now.`, "color: green; font-family: cursive; font-size: 14px;");
  }
}
disableTimer.onclick = function () {
  if (!(timer_bool)) {
    switch (true) {
      case InfoGame.innerHTML != NoneHover && currentGProperties.timeValue != null:
        InfoGame.innerHTML = `${Hover} times in ${currentGProperties.timeValue} seconds`;
        break;

      case InfoGame.innerHTML != "?" && Hover != '':
        InfoGame.innerHTML = `${Hover} times`;
        break;

      case Hover != '':
        InfoGame.innerHTML = "?";
        break;

      default:
        InfoGame.innerHTML = NoneHover;
        break;
    }

    timer_bool = true;
    disableTimer.innerHTML = "disable timer";
    disableTimer.title = "Click To Disable Timer In Game.";
  }
  else {
    switch (true) {
      case InfoGame.innerHTML != "?" && Hover != '':
        InfoGame.innerHTML = `${Hover} times`;
        break;

      case Hover != '':
        InfoGame.innerHTML = "?";
        break;

      default:
        InfoGame.innerHTML = NoneHover;
        break;
    }

    timer_bool = false;
    disableTimer.innerHTML = "enable timer";
    disableTimer.title = "Click To Enable Timer In Game.";
  }
  console.log(`is the timer active: ${timer_bool}`);
  console.log(`the current time Value in game: ${currentGProperties.timeValue}`);
}

function ShowDiffculty() {
  sub.style.display = "block";
  BtnContainer.style.display = "block";
  menu_back_bth.style.display = "none";
  RestartBtn.style.display = "none";
}
function HideDiffculty() {
  sub.style.display = "none";
  BtnContainer.style.display = "none";
}
function WinFunction() {
  GameHasStart = false;
  StopCPScheck();
  win_sound.play();
  DisplayGame("none");
  menu_back_bth.style.display = "inline";
  RestartBtn.style.display = "inline";
  console.log(currentGProperties.music);
  WinStatus();
  audioStop();
  WinText();
  if (timer_bool) {
    TimerEl.style.display = "none";
    StopTimer();
  }
  function WinText() {
    text.style.display = "none";
    winMessage.style.display = "block";
  }
}
function Back_To_Menu() {
  if (GameModes.customize.isActive) GameModes.customize.isActive = false;
  if (Timeout.style.display == "block") Timeout.style.display = "none";
  GameHasStart = false;
  winMessage.style.display = "none";
  menu_back_bth.style.display = "none";
  RestartBtn.style.display = "none";
  currentGProperties = { timeValue: null, CurrentMusic: null, max: null, gamemode: null };
  count = 0;
  amount_clicks.innerHTML = count;
  InfoGame.innerHTML = NoneHover;
  win = false;
  ShowDiffculty();
  WinStatus();
  console.log(menu_back_bth);
  settings_bth.style.display = "block";
  main.style.backgroundImage = "linear-gradient(aliceblue,azure,rgba(173, 216, 230,0.5))";
  body.style.color = "black";
  document.getElementById("text_on_game").style.backgroundColor = "transparent";
}
function Restart_Game() {
  RestartBtn.style.display = "none";
  winMessage.style.display = "none";
  menu_back_bth.style.display = "none";
  count = 0;
  amount_clicks.textContent = count;
  win = false;
  console.log("%cThe Game Has Been Restarted.", "color: blue; font-family: system-ui;");
  StopCPScheck();
  WinStatus();
  console.log(menu_back_bth);
  ProcessDiff(currentGProperties.max, currentGProperties.timeValue, currentGProperties.CurrentMusic, currentGProperties.gamemode); // max,timeValue,CurrentMusic
}

function DisplayGame(display) {
  text.style.display = display;
  if (!mobile_device) {
    BtnGame.style.display = display;
  } else {
    console.log('block');
    box_click.style.display = display;
  }

  if (timer_bool && currentGProperties.timeValue != null) {
    TimerEl.style.display = display;
    TimerEl.textContent = currentGProperties.timeValue;
    InfoGame.innerHTML = `${currentGProperties.max} times in ${currentGProperties.timeValue} seconds`;
  } else {
    InfoGame.innerHTML = `${currentGProperties.max} times`;
  }
}

function audioStop() {
  if (music_active && currentGProperties.CurrentMusic != null) {
    currentGProperties.CurrentMusic.currentTime = 0;
    currentGProperties.CurrentMusic.pause();
    console.log(`%c${currentGProperties.CurrentMusic} gamemode audio stop`, "color: lightblue; -webkit-text-stroke: 0.2p5x black; text-transform: uppercase;");
  }
  else {
    console.log("%cnone of the musics stop (music disable on settings).", "text-transform: capitalize; color: red;font-family: system-ui; padding: 5px;");
  }
}

function WinStatus() {
  if (win) {
    console.log(`%cwin status: ${win}`, "color: green; text-transform: uppercase; background-color: rgb(235,235,235); border: 1px solid dimgray; border-radius: 2px; padding: 2px;");
  } else {
    console.log(`%cwin status: ${win}`, "color: red; text-transform: uppercase; background-color: rgb(235,235,235); border: 1px solid dimgray; border-radius: 2px; padding: 2px;");
  }
}

function loop_display() {
  console.log(document.getElementById("MusicSelect").files[0].name);
  if (document.getElementById("MusicSelect").files.length > 0) {
    loop_select.style.display = "block";
  } else {
    loop_select.style.display = "none";
  }
}

function ProcessCustomize() {
  var ClickGame = document.getElementById("ClicksAmount").value;
  var TimerGame = document.getElementById("TimerGame").value;
  var MusicVal = document.getElementById("MusicSelect").value;

  if (Number(ClickGame) <= 0 || ClickGame == "") {
    alert("Click Amount Is Invalid! Should Be Positive/More Then 0!");
  } else {
    currentGProperties.max = ClickGame;
    currentGProperties.gamemode = "customize";
    if (Number(TimerGame) <= 0 || TimerGame == "") {
      currentGProperties.timeValue = null;
      TimerGame = null;
    } else {
      currentGProperties.timeValue = TimerGame;
    }
    if (MusicVal != "") {
      var MusicSelect = document.getElementById("MusicSelect").files[0];
      var MusicURL = URL.createObjectURL(MusicSelect);
      console.log(MusicURL);
      document.getElementById("MusicSelect").setAttribute('src', MusicURL);
      var ProcessedMusic = new Audio(`${MusicURL}`);
      if (check_loop.checked) {
        ProcessedMusic.loop = true;
      }
      console.log("%cMusic ON!", "color:green;font-family: calibri;");
      currentGProperties.music = ProcessedMusic;
      ProcessDiff(currentGProperties.max, currentGProperties.timeValue, currentGProperties.music, currentGProperties.gamemode); // ClickGame,TimerGame,CurrentMusic
    } else {
      ProcessDiff(currentGProperties.max, currentGProperties.timeValue, null, currentGProperties.gamemode);
    }
    musics.menu.Customize.pause();
    musics.menu.Customize.currentTime = 0;
    CustomizeField.style.display = "none";
    GameModes.customize.isActive = true;
  }
}

function CustomizeBack() {
  CustomizeField.style.display = "none";
  sub.style.display = "block";
  BtnContainer.style.display = "block";
  musics.menu.Customize.pause();
  musics.menu.Customize.currentTime = 0;
  GameModes.customize.isActive = false;
  InfoGame.innerHTML = NoneHover;
}

function RndClickAmount() {
  document.getElementById("ClicksAmount").value = Math.floor(Math.random() * 1000) + 1;
  document.getElementById("TimerGame").value = Math.floor(Math.random() * 100) + 1;
}

document.querySelector(".StartCustomize").onclick = ProcessCustomize;
document.querySelector(".BackCustomize").onclick = CustomizeBack;
document.querySelector(".RndCustomize").onclick = RndClickAmount;

document.onkeydown = checkKey;
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == "32" && GameHasStart == true) {
    console.log("%cSpaceBar KeyBoard Disabled", "color: red; font-weight: bold; text-transform: uppercase;");
    return false;
  }
}

function click_effect(event) {
  var box = box_click.getBoundingClientRect()
  const box_x = box.left;
  const box_y = box.top;
  var posX = (event.x - box_x);
  var posY = (event.y - box_y);

  console.log(box);

  console.log(`coords of the cursor\n(x = ${posX}, y = ${posY})`);
  increment();

  let ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.left = `${posX}px`;
  ball.style.top = `${posY}px`;
  box_click.append(ball);

  setInterval(() => {
    ball.remove();
  }, 500);

}

function updateValue() {
  var input = document.getElementById("ClicksAmount");
  if (input.value.length > 0) {
    InfoGame.textContent = input.value + " times";
  } else {
    InfoGame.textContent = "x times";
  }
}
