<template>
  <!-- <div class="background" @click="displayClick()"> -->
  <div :style="{ backgroundImage: back_image }" class="background" @click="displayClick()">

    <!-- ホラーアニメーション用 -->
    <img class="img-horror" :src="src_horror" v-show="showHorror">
    <!-- 最初の表示 -->
    <div v-if="currentSceneId == 'entrance'">
      <div class="main-title">{{ title }}</div>
    </div>
    <!-- 2階 -->
    <img v-show="showItem1" class="img-item1" :src="url_item1" @click="getItem('upstairs3')">
    <!-- 1階奥 -->
    <img v-show="showItem2" class="img-item2" :src="url_item2" @click="getItem('backSide3')">
    <!-- 地下室前 -->
    <img v-show="showItem3" class="img-item2" :src="url_item2">
    <!-- 地下室 -->
    <img v-show="showItem4" class="img-item3" :src="url_item3">
    <img v-show="showItem5" class="img-item1" :src="url_item1">
    <!-- エンドロール -->
    <div v-show="showEnd" class="end-title">{{ title }}</div>
    <!-- ストーリーテキスト -->
    <div class="story-Box">
      <div class="txt-story" v-for="(storyline, LineIndex) in txt_story" :key="LineIndex">
        {{ storyline }}
      </div>
    </div>
    <!-- 場面毎の選択肢 -->
    <div v-if="currentChoice">
      <div v-for="(choice, index) in currentChoice.choices" :key="index">
        <button class="btn1" :class="{ 'btnTop': index == 0, 'btnBottom': index == 1, 'btnMiddle': index == 2 }"
          @click="changeScene(choice.nextId)">{{ choice.text }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue'
import anime from 'animejs';
// 場面毎の情報
import scenes from '@/assets/json/scene.json';
// 選択肢の情報
import choices from '@/assets/json/choice.json';
// ホラーシーンの情報
import horrorScenes from '@/assets/json/horrorScene.json';
// 画像インポート
import url_horror6 from '/img/horror6.png';
import url_item1 from '/img/item1.png';
import url_item2 from '/img/item2.png';
import url_item3 from '/img/demon1.png';

// 効果音インポート
import vc_usotuki from '/audio/se/9_usotuki.wav';
import vc_devil1 from '/audio/se/devil_groaning3.mp3';
import se_rei_warai from '/audio/se/15rei_warai.wav';
import se_rei_voice from '/audio/se/reivoice01.wav';

// テキストインポート
import txt_story5 from "/text/story5.txt?raw";
import txt_story7 from "/text/story7.txt?raw";

/////////////////////////////////////////
//リアクティブデータ
/////////////////////////////////////////
//現在のシーンid
const currentSceneId = ref("entrance");
// const currentSceneId = ref("frontDoor1");
//背景画像
const back_image = ref("")
//現在のシーン
const currentScene = computed(() => scenes.find(scene => scene.id === currentSceneId.value));
//現在の選択肢
const currentChoice = computed(() => choices.find(choice => choice.id === currentSceneId.value));
//現在のホラーシーン
const currentHorror = computed(() => horrorScenes.find(scene => scene.id === currentSceneId.value));

////////////////////////////////////////
// 設定
////////////////////////////////////////
const title = 'The End Of Fear'
const msg_alert = 'このサイトでは恐怖を与える表現が含まれています。ご入場される場合は音量をONにしてヘッドフォンの着用をお奨めします。'

//背景音と効果音
const msc_back = new Audio();
msc_back.volume = 0.2;
const msc_eft = new Audio(); //効果音
msc_eft.volume = 1.0;

//アイテムの表示
const src_horror = ref('')
const showHorror = ref(false)
const showItem1 = ref(false)
const showItem2 = ref(false)
const showItem3 = ref(false)
const showItem4 = ref(false)
const showItem5 = ref(false)
const showEnd = ref(false)

let act_item1 = 0;
let act_item2 = 0;

//テキストの設定
const txt_story = ref([])
let storyLines = []; // 
let LineIndex = 0; // 現在表示中の行のインデックス
let txtInterval = 0;

// テキスト音読設定
const uttr = new SpeechSynthesisUtterance()
uttr.lang = "ja-JP" // 言語を設定
uttr.rate = 0.65     // 速度を設定
uttr.pitch = 0    // 高さを設定
uttr.volume = 1.0     // 音量を設定
let voice = speechSynthesis.getVoices();

// 終了フラグ
let endflg = 0;

// タイマー用のid
let timeId = 0;

//画面内の誤操作用
document.onselectstart = () => false;

// ランダム整数取得
const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

////////////////////////////////////////////////
// マウント時の初期処理
////////////////////////////////////////////////
onMounted(() => {
  // ページ読み込み完了時
  window.onload = () => {
    alert(msg_alert)
  }
  //初期シーン表示
  changeScene(currentSceneId.value)
});

////////////////////////////////////////////////
// シーンの変更処理
////////////////////////////////////////////////
async function changeScene(sceneId) {
  currentSceneId.value = sceneId;

  console.log('changeScene', sceneId)
  console.log('changeScene', currentScene.value)

  //初期処理
  initChange();

  //シーン毎の特殊処理
  switch (currentSceneId.value) {
    // 入口 入る
    case 'forest':
      get_Voice();
      break;
    // 1階奥
    case 'backSide1':
      //アイテムの表示を初期化
      showItem1.value = 0;
      act_item1 = 0;
      break;
    // 地下室の扉前
    case 'frontDoor1':
      //アイテムの表示を初期化
      showItem2.value = 0;
      act_item2 = 0;
      break;
    //地下室の扉を開く
    case 'frontDoor2':
      // アニメーション
      showItem3.value = 1;
      anime({
        targets: '.img-item2',
        translateY: [0, -150],
        translateX: -50,
        scale: [1, 2],
        duration: 4000,
        rotate: [0, 180],
        easing: 'easeInOutCubic' // 加減速の種類
      });
      break;
    //地下室
    case 'basement1':
      //アイテムの表示を初期化
      showItem3.value = 0;
      break;
    //地下室なにか出現
    case 'basement2':
      // アニメーション
      showItem4.value = 1;
      anime({
        targets: '.img-item3',
        translateY: [-100, 200, 0],
        translateX: [200, -300, 0],
        opacity: [0.5, 1],
        scale: [0.5, 3],
        duration: 15000,
        easing: 'easeInOutCubic' // 加減速の種類
      });
      break;
    //地下室なにか出現後
    case 'basement6':
      // アニメーション
      anime({
        targets: '.img-item3',
        opacity: [1, 0],
        scale: [3, 1],
        duration: 3000,
        easing: 'easeInOutCubic' // 加減速の種類
      });
      anime({
        targets: '.img-item1',
        duration: 3000,
        rotate: 300,
        translateY: -100,
        easing: 'easeInOutCubic' // 加減速の種類
      });
      // 効果音
      eft_Play(vc_devil1)
      break;
    //外に出てから
    case 'outside1':
      //アイテムの表示を初期化
      showItem4.value = 0;
      showItem5.value = 0;
      break;
    //最後の場面
    case 'outside2':
      // 背景のアニメーション
      anime({
        targets: '.background',
        scale: [0, 2],
        opacity: 1,
        duration: 3000,
        easing: 'linear' // 加減速の種類
      });
      // アニメーション
      src_horror.value = url_horror6
      setTimeout(() => {
        showHorror.value = 1;
        anime({
          targets: '.img-horror',
          opacity: [0, 1],
          scale: [0, 1],
          translateY: [1000, 150],
          duration: 1000,
          easing: 'easeInOutBounce', // 加減速の種類
        });
      }, 2500);
      setTimeout(() => {
        showEnd.value = 1
      }, 10000);
      break;
    //戻る操作
    case 'back':
      window.history.back();
      return;
    //ホラーシーンへ
    case 'exit1':
    case 'exit2':
    case 'exit3':
    case 'exit4':
    case 'exit5':
      horrorScene()
      return;
    default:
  }

  //シーン毎の共通処理
  //currentSceneに該当するidがある場合のみ
  if (!currentScene.value) return

  //背景変更
  if (currentScene.value.background) {
    //入り口では普通に表示
    if (currentSceneId.value == 'entrance') {
      back_image.value = "url(" + currentScene.value.background + ")";
    } else {
      backFade(currentScene.value.background);
    }
  }
  //音楽変更
  if (currentScene.value.music) {
    changeMsc(currentScene.value.music);
  }
  //効果音１
  if (currentScene.value.effect1) {
    eft_Play(currentScene.value.effect1);
  }
  //効果音2
  if (currentScene.value.effect2) {
    setTimeout(() => {
      eft_Play(currentScene.value.effect2);
    }, currentScene.value.effectTime);
  }
  //テキスト表示
  if (currentScene.value.text) {
    await loadStory(currentScene.value.text, 1);
  }
}

////////////////////////////////////////
//ホラーシーン
////////////////////////////////////////
function horrorScene() {
  if (currentSceneId.value == 'exit5') {
    showItem1.value = 0;
    act_item1 = 0;
  }
  // テキスト再生
  readStory(currentHorror.value.text);
  //エフェクト
  if (currentHorror.value.effect1) {
    eft_Play(currentHorror.value.effect1)
  }
  //ホラー音
  if (currentHorror.value.effect2) {
    setTimeout(() => {
      eft_Play(currentHorror.value.effect1)
      if (currentHorror.value.effect3) {
        setTimeout(() => {
          eft_Play(currentHorror.value.effect3)
        }, currentHorror.value.effect3Time);
      }
    }, currentHorror.value.effect2Time);
  }
  // アニメーション
  showHorror.value = 1;
  anime_Horror(currentHorror.value.img)
}

///////////////////////////////////////
//アイテム取得
//////////////////////////////////////
function getItem(sceneId) {
  currentSceneId.value = sceneId;
  switch (sceneId) {
    // 2階 人形ゲット
    case 'upstairs3':
      if (act_item1 == 1) {
        break;
      } else {
        act_item1 = 1
        initChange();
        loadStory(txt_story5, 2);
        eft_Play(se_rei_warai)
        // アニメーション
        anime({
          targets: '.img-item1',
          translateY: -200,
          scale: [1, 3],
          duration: 5000,
          rotate: 330,
          easing: 'easeInOutCubic' // 加減速の種類
        });
      }
      break;
    // 一階鍵ゲット
    case 'backSide3':
      if (act_item2 == 1) {
        break;
      } else {
        act_item2 = 1
        initChange();
        eft_Play(se_rei_voice)
        loadStory(txt_story7, 2);
        // アニメーション
        anime({
          targets: '.img-item2',
          translateY: -200,
          scale: [1, 3],
          duration: 4000,
          rotate: 180,
          easing: 'easeInOutCubic' // 加減速の種類
        });
      }
      break;
    default:
      console.log('エラーその他処理');
  }
}

///////////////////////////////////////
//特殊アイテムの動き
///////////////////////////////////////
function actionItem(sceneId) {
  console.log('actionItem', sceneId)
  //選択処理
  switch (sceneId) {
    case 'basement4':
      // アニメーション
      showItem5.value = 1;
      anime({
        targets: '.img-item1',
        translateX: [200, -200, 0],
        translateY: [-200, 100, -100],
        scale: [1, 2],
        duration: 5000,
        rotate: 360,
        easing: 'easeInOutCubic' // 加減速の種類
      });
      // 効果音
      eft_Play(se_rei_voice)
      timeId = setTimeout(() => {
        eft_Play(vc_usotuki)
      }, 5000);
      // 現在地更新
      timeId = setTimeout(() => {
        currentSceneId.value = 'basement5';
      }, 8000);
      break;
    default:
      console.log('エラーその他処理');
  }
}

/////////////////////////////////////////
// 画面クリック
////////////////////////////////////////
function displayClick() {
  //選択肢が出ている場合は処理しない
  if (currentChoice.value) return
  //ストーリーテキスト表示中
  if (storyLines.value) {
    if (LineIndex < storyLines.value.length) {
      displayNextLine()
      if (currentSceneId.value == 'outside1') {
        if (LineIndex == 6) {
          // 今の背景フェードアウト
          anime({
            targets: '.background',
            opacity: [1, 0],
            duration: 13000,
            easing: 'linear', // 加減速の種類
            complete: () => {
              endflg = 1;
            },
          });
        }
      }
    } else {
      //ストーリーテキスト完了時
      if (currentScene.value) {
        currentSceneId.value = currentScene.value.nextId;
      }
      console.log('displayClick', currentSceneId.value)
      //シーン毎の処理
      switch (currentSceneId.value) {
        case 'upstairs2':
          showItem1.value = 1;
          break;
        case 'upstairs3':
          act_item1 = 1;
          currentSceneId.value = 'upstairsChoice';
          break;
        case 'backSide2':
          showItem2.value = 1;
          break;
        case 'backSide3':
          act_item2 = 1;
          currentSceneId.value = 'backSideChoice';
          break;
        case 'frontDoor2':
          changeScene(currentSceneId.value)
          break;
        case 'frontDoor3':
          changeScene('basement1')
          break;
        case 'basement2':
          changeScene(currentSceneId.value)
          break;
        case 'basement3':
          currentSceneId.value = 'basement4'
          actionItem(currentSceneId.value)
          break;
        case 'basement5':
          changeScene('basement6')
          break;
        default:
      }
      // 最終シーン
      if (endflg == 1) {
        changeScene('outside2')
      }

    }
  }
}
//////////////////////////////////////////
// シーン転換時の初期処理
/////////////////////////////////////////
function initChange() {
  clearTimeout(timeId);
  clearInterval(txtInterval);
  // window.speechSynthesis.cancel();
  showHorror.value = 0;
  txt_story.value = ['']
  storyLines = []
  LineIndex = 0;
}

///////////////////////////////////////
// 音声ゲット
//////////////////////////////////////
function get_Voice() {
  voice = speechSynthesis.getVoices().find(function (voice) {
    // console.log(voice.name);
    return voice.name === 'Microsoft Ichiro - Japanese (Japan)';
  });
  // 取得できた場合のみ適用する
  if (voice) {
    uttr.voice = voice;
  }
}

/////////////////////////////////
// テキスト読込
////////////////////////////////
async function loadStory(txt, type) {
  let text
  if (type == 1) {
    const response = await fetch(`${txt}`);
    const getText = await response.text();
    text = getText.replace(/\r\n|\r/g, '\n');
  } else {
    // 改行コードを統一
    text = txt.replace(/\r\n|\r/g, '\n');
  }
  // 改行ごとに分割して配列に格納
  let fileLines = text.split('\n');
  // linesを更新
  storyLines.value = fileLines;
}
///////////////////////////////////////
// 次のテキストを表示する際
///////////////////////////////////////
function displayNextLine() {
  // 1行目の場合
  if (txt_story.value == '') {
    readStory(storyLines.value[LineIndex])
  } else {
    // 表示中の場合は現在行を全て表示
    if (txt_story.value[LineIndex].length < storyLines.value[LineIndex].length) {
      clearInterval(txtInterval);
      txt_story.value[LineIndex] = storyLines.value[LineIndex]
    } else {
      // 表示済みの場合は次の行を表示
      LineIndex++;
      if (LineIndex < storyLines.value.length) {
        readStory(storyLines.value[LineIndex])
      }
    }
  };
};
/////////////////////////////////////
// テキストを読む処理
/////////////////////////////////////
function readStory(txt) {
  // 空行の場合、改行コードのみ
  if (txt == '') {
    txt_story.value[LineIndex] = '\n';
  } else {
    // テキストを一文字ずつ表示
    window.speechSynthesis.cancel();
    uttr.text = txt;
    window.speechSynthesis.speak(uttr);
    let cnt = 0;
    txtInterval = setInterval(() => {
      cnt = cnt + 1;
      txt_story.value[LineIndex] = txt.substr(0, cnt);
      if (cnt == txt.length) {
        clearInterval(txtInterval);
      }
    }, 210);
  }
}

// エフェクト音再生
function eft_Play(msc) {
  msc_eft.src = msc;
  msc_eft.play();
}
// 音楽再生
function changeMsc(msc) {
  msc_back.src = msc;
  msc_back.play();
}

/////////////////////////////////////
// シーン転換時の背景アニメーション
////////////////////////////////////
function backFade(image) {
  // 今の背景フェードアウト
  anime({
    targets: '.background',
    opacity: [1, 0],
    scale: [1, 3],
    duration: 2500,
    easing: 'easeInOutCubic' // 加減速の種類
  });
  // 次の背景フェードイン
  setTimeout(() => {
    back_image.value = "url(" + image + ")";
    anime({
      targets: '.background',
      opacity: [0, 1],
      scale: [0, 1],
      duration: 2500,
      easing: 'easeInOutCubic' // 加減速の種類
    });
  }, 2500);
}

/////////////////////////////////////////
// ホラーシーンでののアニメーション
/////////////////////////////////////////
function anime_Horror(image) {
  src_horror.value = image
  anime({
    targets: '.img-horror',
    translateX: [
      { value: randRange(-500, 500), duration: randRange(0, 1000), delay: randRange(0, 1000) },
      { value: randRange(-500, 500), duration: randRange(0, 1000), delay: randRange(0, 1000) },
      { value: 0, duration: randRange(0, 1000), delay: randRange(0, 1000) }
    ],
    translateY: [
      { value: randRange(-500, 500), duration: randRange(0, 1000), delay: randRange(0, 1000) },
      { value: randRange(-500, 500), duration: randRange(0, 1000), delay: randRange(0, 1000) },
      { value: 0, duration: randRange(0, 1000), delay: randRange(0, 1000) }
    ],
    opacity: [0, 1],
    scale: [0, 0.5, 0.1, 1],
    duration: 5000,
    rotate: 360,
    easing: 'easeInOutBounce', // 加減速の種類
    complete: function (anim) { //callback関数
      anime.set('.img-horror', {
        rotate: 0,
      });
    }
  });
  //メニュー表示
  setTimeout(() => {
    currentSceneId.value = 'reEnter';
  }, 7500);
}

</script>

<style>
body {
  font-family: "ふぉんとうは怖い明朝体";
  background-color: #150813;
}

.background {
  /* background-image: v-bind(back_image); */
  background-position: center top;
  height: 100vh;
  max-width: 1024px;
  margin: auto;
  text-align: center;
}

.story-Box {
  padding-top: 2vh;
  font-size: 22px;
  text-align: center;
  word-break: normal;
  color: lightsteelblue;
  overflow: hidden;
  white-space: pre-wrap;
}

.txt-story {
  margin: auto;
  max-width: 800px;
}

.img-horror {
  height: 100%;
  width: auto;
}

@media screen and (max-width: 480px) {

  /* 480px以下に適用されるCSS（スマホ用） */
  .img-horror {
    position: absolute;
    top: 0%;
    left: -50%;
    height: 100%;
  }
}

.img-item1 {
  position: absolute;
  top: 65%;
  left: 25%;
  height: 25%;
}

.img-item2 {
  position: absolute;
  top: 65%;
  left: 20%;
  height: 25%;
}

.img-item3 {
  position: absolute;
  top: 35%;
  left: 15%;
}

/* タイトル */
.main-title {
  font-family: "Segoe Script";
  margin: auto;
  overflow: hidden;
  font-weight: bold;
  animation: main-title 5s linear;
  font-size: 68px;
  color: #DD0000;
}

/* タイトル */
.end-title {
  font-family: "Segoe Script";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  animation: main-title 8s linear;
  font-size: 60px;
  color: #DD0000;
}

/* タイトルアニメーション */
@keyframes main-title {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* ボタン共通 */
.btn1 {
  width: 250px;
  padding: 3px;
  font-size: 36px;
  color: #DD0000;
  text-align: center;
  text-decoration: none;
  outline: none;
  /*はみ出す背景色を隠す*/
  overflow: hidden;
  border-radius: 10px;
  transition: all 300ms ease-in-out;
  box-shadow: 0 0 10px 4px #999999;
  background: rgba(21, 8, 19, 0.5);
}

.btn1:hover {
  background: #150813;
}

.btnTop {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  animation: show 1.5s;
}

.btnBottom {
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  animation: show 1.7s;
}

.btnMiddle {
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  animation: show 1.9s;
}

/* CSSアニメーションの設定 */
@keyframes show {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>