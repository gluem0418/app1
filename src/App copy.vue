<template>

  <div class="background" @click="displayClick()">

    <div class="story-Box">
      <div class="txt-story" v-for="(storyline, LineIndex) in txt_story" :key="LineIndex">
        {{ storyline }}
      </div>
    </div>
    <!-- ホラーアニメーション用 -->
    <img class="img-horror" :src="src_horror" v-show="showHorror">
    <!-- 最初の表示 -->
    <div v-if="Location == 'Entrance'">
      <div class="main-title">
        The End Of Fear
      </div>
      <div class="btn-1" id="btn-a">
        <!-- <button @click="changeShow('Enter')">入る</button> -->
        <button @click="changeShow('Outside1')">入る</button>
      </div>
      <div class="btn-1" id="btn-b">
        <button onclick="window.history.back()">入らない</button>
      </div>
    </div>
    <!-- 森の中 -->
    <div v-if="Location == 'Forest'">
      <div class="btn-1" id="btn-a">
        <button @click="changeShow('Move_on')">森を進む</button>
      </div>
      <div class="btn-1" id="btn-b">
        <button @click="changeShow('Exit1')">後ろへ戻る</button>
      </div>
    </div>
    <!-- 館の入口 -->
    <div v-if="Location == 'Front'">
      <div class="btn-1" id="btn-a">
        <button @click="changeShow('Into')">館に入る</button>
      </div>
      <div class="btn-1" id="btn-b">
        <button @click="changeShow('Exit2')">通り過ぎる</button>
      </div>
    </div>
    <!-- 館のロビー -->
    <div v-if="Location == 'Lobby'">
      <div class="btn-1" id="btn-a">
        <button @click="changeShow('Exit4')">地下へ</button>
      </div>
      <div class="btn-1" id="btn-c">
        <button @click="changeShow('Exit3')">1階奥へ</button>
      </div>
      <div class="btn-1" id="btn-b">
        <button @click="changeShow('Upstairs1')">2階へ</button>
      </div>
    </div>
    <!-- 2階 -->
    <!-- <img class="img-item1" :src="src_item1" @click="changeShow('Upstairs3')" v-show="showItem1"> -->
    <img class="img-item1" :src="src_item1" @click="getItem('Upstairs3')" v-show="showItem1">
    <!-- 2階ゲット後 -->
    <div v-if="Location == 'Upstairs4'">
      <div class="btn-1" id="btn-a">
        <button @click="changeShow('Exit5')">地下へ</button>
      </div>
      <div class="btn-1" id="btn-b">
        <button @click="changeShow('Back1')">1階奥へ</button>
      </div>
    </div>
    <!-- 1階奥 -->
    <img class="img-item2" :src="src_item2" @click="getItem('Back3')" v-show="showItem2">
    <!-- 1階ゲット後 -->
    <div v-if="Location == 'Back4'">
      <div class="btn-1" id="btn-a">
        <button @click="changeShow('Basement1')">ちかへ</button>
      </div>
      <div class="btn-1" id="btn-c">
        <button @click="changeShow('Basement1')">地下へ</button>
      </div>
      <div class="btn-1" id="btn-b">
        <button @click="changeShow('Basement1')">チカヘ</button>
      </div>
    </div>
    <!-- 地下室前 -->
    <img class="img-item2" :src="src_item2" v-show="showItem3">
    <!-- 地下室 -->
    <img class="img-item3" :src="src_item3" v-show="showItem4">
    <img class="img-item1" :src="src_item1" v-show="showItem5">
    <!-- 地下室後 -->
    <div v-if="Location == 'Basement11'">
      <div class="btn-1" id="btn-a">
        <button @click="changeShow('Outside1')">外に出る</button>
      </div>
    </div>

    <!-- やられた後 -->
    <div v-if="Location == 'ReEnter'">
      <div class="btn-1" id="btn-a">
        <button @click="changeShow('Enter')">最初から</button>
      </div>
      <div class="btn-1" id="btn-b">
        <button onclick="window.history.back()">もう出る</button>
      </div>
    </div>

    <div class="end-title" v-show="showEnd">
      The End Of Fear
    </div>

  </div>

</template>

<script setup>

import { ref, onMounted } from 'vue'

import anime from 'animejs';

// 背景インポート
import url_forest1 from '@/assets/img/forest1.jpg';
import url_forest2 from '@/assets/img/forest2.jpg';
import url_mansion1 from '@/assets/img/mansion1.jpg';
import url_entrance1 from '@/assets/img/entrance1.jpg';
import url_upstairs1 from '@/assets/img/upstairs1.jpg';
import url_back1 from '@/assets/img/back1.jfif';
import url_basement1 from '@/assets/img/basement1.jfif';
import url_basement2 from '@/assets/img/basement2.jfif';
import url_forest3 from '@/assets/img/forest3.jpg';

// 画像インポート
import url_horror1 from '@/assets/img/horror1.png';
import url_horror2 from '@/assets/img/horror2.jpg';
import url_horror3 from '@/assets/img/horror3.png';
import url_horror4 from '@/assets/img/horror4.png';
import url_horror5 from '@/assets/img/horror5.jpg';
import url_horror6 from '@/assets/img/horror6.png';

import url_item1 from '@/assets/img/item1.png';
import url_item2 from '@/assets/img/item2.png';
import url_item3 from '@/assets/img/demon1.png';

// 曲インポート
import msc_kimyo from '@/assets/audio/bgm/z44.mp3';
import msc_buriki from '@/assets/audio/bgm/k6.mp3';
import msc_kokun from '@/assets/audio/bgm/v6.mp3';
import msc_tsukiyo from '@/assets/audio/bgm/n105.mp3';
import msc_ankoku from '@/assets/audio/bgm/n24.mp3';
import msc_entoro from '@/assets/audio/bgm/v7.mp3';
import msc_asonoikari from '@/assets/audio/bgm/n137.mp3';
import msc_ningyo from '@/assets/audio/bgm/v2.mp3';
import msc_daten from '@/assets/audio/bgm/MusMus-BGM-110.mp3';

// 効果音インポート
import vc_dareda from '@/assets/audio/se/dareda.wav';
import vc_gyaaaa from '@/assets/audio/se/gyaaaa_d.wav';
import vc_tasukete from '@/assets/audio/se/9_tasukete.wav';
import vc_nigasanai from '@/assets/audio/se/nigasanai.wav';
import vc_kimokimo from '@/assets/audio/se/kimokimo.wav';
import vc_kai_gaaa from '@/assets/audio/se/kaibutu_gaaa.wav';
import vc_monster1 from '@/assets/audio/se/monster_roaning3.mp3';
import vc_anatano from '@/assets/audio/se/anatanoushiro.wav';
import vc_usotuki from '@/assets/audio/se/9_usotuki.wav';
import vc_devil1 from '@/assets/audio/se/devil_groaning3.mp3';

import se_tuchi from '@/assets/audio/se/土の上を歩く.mp3';
import se_door1 from '@/assets/audio/se/門を開ける.mp3';
import se_door2 from '@/assets/audio/se/ドア・大扉閉める02.mp3';
import se_ashioto1 from '@/assets/audio/se/足音・スポーツシューズ.mp3';
import se_rei_warai from '@/assets/audio/se/15rei_warai.wav';
import se_rei_voice from '@/assets/audio/se/reivoice01.wav';
import se_moujya from '@/assets/audio/se/moujya2.wav';
import se_zowawa from '@/assets/audio/se/6zowawa.wav';
import se_kagi1 from '@/assets/audio/se/鍵を開ける1.mp3';

// テキストインポート
import txt_story1 from "@/assets/text/story1.txt?raw";
import txt_story2 from "@/assets/text/story2.txt?raw";
import txt_story3 from "@/assets/text/story3.txt?raw";
import txt_story4 from "@/assets/text/story4.txt?raw";
import txt_story5 from "@/assets/text/story5.txt?raw";
import txt_story6 from "@/assets/text/story6.txt?raw";
import txt_story7 from "@/assets/text/story7.txt?raw";
import txt_story8 from "@/assets/text/story8.txt?raw";
const txt_story9 = 'モッテいた鍵でトビラはフ自然に開いタ'
import txt_story10 from "@/assets/text/story10.txt?raw";
import txt_story11 from "@/assets/text/story11.txt?raw";
import txt_story12 from "@/assets/text/story12.txt?raw";
import txt_story13 from "@/assets/text/story13.txt?raw";

const txt_horror1 = '戻ろうとした瞬間、背後から突然'
const txt_horror2 = '不気味なので、迂回しようとすると'
const txt_horror3 = '奥に誰かの気配がしたので進むと'
const txt_horror4 = '地下への階段へと向かおうとすると'
const txt_horror5 = '地下への階段を下りていくと、突然'

const msg_alert = 'このサイトでは恐怖を与える表現が含まれています。入る場合は音量をONにしてヘッドフォンでのご入場をお奨めします。'

// 初期設定
const back_image = ref("url(" + url_forest1 + ")")
const Location = ref('Entrance')
document.onselectstart = () => false;

const msc_back = new Audio(); //背景音
msc_back.volume = 0.2;

const msc_eft = new Audio(); //効果音
msc_eft.volume = 1.0;

const src_horror = ref('')
const src_item1 = ref('')
const src_item2 = ref('')
const src_item3 = ref('')
const showHorror = ref(false)
const showItem1 = ref(false)
const showItem2 = ref(false)
const showItem3 = ref(false)
const showItem4 = ref(false)
const showItem5 = ref(false)
const showEnd = ref(false)

const txt_story = ref([])
let storyLines = []; // 
let LineIndex = 0; // 現在表示中の行のインデックス

// const showHorror = ref(0)
let cnt_click = 0;
let txtInterval = 0;
let timeId = 0;
let timeIdE = 0;
let act_item1 = 0;
let act_item2 = 0;
let endflg = 0;

// テキスト音読設定
const uttr = new SpeechSynthesisUtterance()
uttr.lang = "ja-JP" // 言語を設定
uttr.rate = 0.65     // 速度を設定
uttr.pitch = 0    // 高さを設定
uttr.volume = 1.0     // 音量を設定

// 音声ゲット（初回）
var voices = speechSynthesis.getVoices();
// uttr.text = 'テスト';
// window.speechSynthesis.speak(uttr);

src_item1.value = url_item1
src_item2.value = url_item2
src_item3.value = url_item3

// ランダム整数取得
const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// 場面変更
function changeShow(str_select) {
  //初期処理
  initChange();
  //現在地変更
  Location.value = str_select
  //選択処理
  switch (str_select) {
    // 入口 入る
    case 'Enter':
      get_Voice();
      //場面転換'
      backFade(url_forest2);
      changeMsc(msc_kimyo);
      eft_Play(se_tuchi);
      loadStory(txt_story1);
      break;
    // 森 進む
    case 'Move_on':
      //場面転換
      backFade(url_mansion1);
      changeMsc(msc_buriki);
      eft_Play(se_tuchi);
      loadStory(txt_story2);
      break;
    // 館の前 入る
    case 'Into':
      //場面転換
      backFade(url_entrance1);
      changeMsc(msc_kokun);
      eft_Play(se_door1)
      setTimeout(() => {
        eft_Play(se_door2)
      }, 3000);
      loadStory(txt_story3);
      break;
    // ロビー 二階へ
    case 'Upstairs1':
      //場面転換
      backFade(url_upstairs1);
      changeMsc(msc_tsukiyo);
      loadStory(txt_story4);
      eft_Play(se_ashioto1)
      break;
    // 二階 一階奥へ
    case 'Back1':
      //場面転換
      showItem1.value = 0;
      act_item1 = 0;
      backFade(url_back1);
      changeMsc(msc_ankoku);
      eft_Play(se_ashioto1)
      setTimeout(() => {
        eft_Play(se_moujya)
      }, 10000);
      loadStory(txt_story6);
      break;
    // 一階 地下室へ
    case 'Basement1':
      //場面転換
      showItem2.value = 0;
      backFade(url_basement1);
      changeMsc(msc_entoro);
      eft_Play(se_ashioto1)
      setTimeout(() => {
        eft_Play(se_zowawa)
      }, 7000);
      loadStory(txt_story8);
      break;
    // 地下室入口
    case 'Basement3':
      // 場面での処理
      eft_Play(se_kagi1)
      setTimeout(() => {
        eft_Play(se_door1)
      }, 2000);
      loadStory(txt_story9);
      // アニメーション
      showItem3.value = 1;
      anime({
        targets: '.img-item2',
        translateY: [0, -150],
        translateX: -50,
        scale: [1, 2],
        duration: 4000,
        rotate: [0, 180],
        // easing: 'linear' // 加減速の種類
        easing: 'easeInOutCubic' // 加減速の種類
      });
      break;
    // 地下室へ
    case 'Basement4':
      //場面転換
      showItem3.value = 0;
      backFade(url_basement2);
      eft_Play(vc_kimokimo)
      timeId = setTimeout(() => {
        eft_Play(vc_kimokimo)
      }, 10000);
      loadStory(txt_story10);
      break;
    // 地下室、目の前に。。。
    case 'Basement6':
      // アニメーション
      changeMsc(msc_asonoikari);
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
      // テキスト再生
      loadStory(txt_story11);
      // 効果音
      eft_Play(vc_monster1)
      timeId = setTimeout(() => {
        eft_Play(vc_kai_gaaa)
      }, 6000);
      break;
    case 'Basement8':
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
        Location.value = 'Basement9';
      }, 8000);
      break;
    case 'Basement10':
      // テキスト再生
      loadStory(txt_story12);
      // 場面展開
      changeMsc(msc_ningyo);
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
    // 外へ
    case 'Outside1':
      //場面転換
      showItem4.value = 0;
      showItem5.value = 0;
      backFade(url_forest3);
      // テキスト再生
      // uttr.rate = 0.65     // 速度を設定
      loadStory(txt_story13);
      // 効果音
      eft_Play(se_ashioto1)
      timeId = setTimeout(() => {
        eft_Play(se_tuchi)
      }, 5000);
      break;
    case 'Outside2':
      // 場面展開
      txt_story.value = '';
      changeMsc(msc_daten);
      // 背景
      anime({
        targets: '.background',
        // translateY: [0, -200],
        // translateX: [0, -50],
        scale: [0, 2],
        opacity: 1,
        duration: 3000,
        easing: 'linear' // 加減速の種類
      });
      // テキスト再生
      eft_Play(vc_nigasanai)
      setTimeout(() => {
        eft_Play(vc_kai_gaaa)
      }, 2500);
      // アニメーション
      src_horror.value = url_horror6
      setTimeout(() => {
        showHorror.value = 1;
        anime({
          targets: '.img-horror',
          opacity: [0, 1],
          scale: [0, 1],
          // translateY: [1000, 200],
          // translateX: [200, 0],
          translateY: [1000, 150],
          duration: 1000,
          easing: 'easeInOutBounce', // 加減速の種類
        });
      }, 2500);
      setTimeout(() => {
        showEnd.value = 1
      }, 10000);
      break;
    case 'Exit1':
      // テキスト再生
      readStory(txt_horror1);
      // ホラー音
      setTimeout(() => {
        eft_Play(vc_tasukete)
        setTimeout(() => {
          eft_Play(vc_gyaaaa)
        }, 2500);
      }, 2500);
      // アニメーション
      showHorror.value = 1;
      anime_Horror(url_horror1)
      break;
    case 'Exit2':
      // テキスト再生
      readStory(txt_horror2);
      // 効果音
      eft_Play(se_tuchi);
      // ホラー音
      setTimeout(() => {
        eft_Play(vc_nigasanai)
        setTimeout(() => {
          eft_Play(vc_gyaaaa)
        }, 2500);
      }, 2500);
      //アニメーション
      showHorror.value = 1;
      anime_Horror(url_horror2)
      break;
    case 'Exit3':
      // テキスト再生
      readStory(txt_horror3);
      // 効果音
      eft_Play(se_ashioto1)
      // ホラー音
      setTimeout(() => {
        eft_Play(vc_dareda)
        setTimeout(() => {
          eft_Play(vc_gyaaaa)
        }, 2500);
      }, 2500);
      //アニメーション
      showHorror.value = 1;
      anime_Horror(url_horror3)
      break;
    case 'Exit4':
      // テキスト再生
      readStory(txt_horror4);
      // 効果音
      eft_Play(se_ashioto1)
      // ホラー音
      setTimeout(() => {
        eft_Play(vc_anatano)
        setTimeout(() => {
          eft_Play(vc_gyaaaa)
        }, 2500);
      }, 2500);
      //アニメーション
      showHorror.value = 1;
      anime_Horror(url_horror4)
      break;
    case 'Exit5':
      showItem1.value = 0;
      act_item1 = 0;
      // テキスト再生
      readStory(txt_horror5);
      // 効果音
      eft_Play(se_ashioto1)
      // ホラー音
      setTimeout(() => {
        eft_Play(vc_kimokimo)
        setTimeout(() => {
          eft_Play(vc_kai_gaaa)
        }, 2500);
      }, 2500);
      //アニメーション
      showHorror.value = 1;
      anime_Horror(url_horror5)
      break;
    default:
      console.log('エラーその他処理');
  }
}
function getItem(str_select) {
  //現在地変更
  Location.value = str_select
  //選択処理
  switch (str_select) {
    // ぬいぐるみゲット
    case 'Upstairs3':
      if (act_item1 == 1) {
        break;
      } else {
        // 場面の処理
        act_item1 = 1
        initChange();
        loadStory(txt_story5);
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
    case 'Back3':
      if (act_item2 == 1) {
        break;
      } else {
        act_item2 = 1
        initChange();
        eft_Play(se_rei_voice)
        loadStory(txt_story7);
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

// 画面をクリックした時
function displayClick() {
  //場面毎の処理
  switch (Location.value) {
    case 'Enter':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        Location.value = 'Forest';
      }
      break;
    case 'Move_on':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        Location.value = 'Front';
      }
      break;
    case 'Into':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        Location.value = 'Lobby';
      }
      break;
    case 'Upstairs1':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        Location.value = 'Upstairs2';
        showItem1.value = 1;
      }
      break;
    case 'Upstairs3':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        Location.value = 'Upstairs4';
        act_item1 = 1;
      }
      break;
    case 'Back1':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        Location.value = 'Back2';
        showItem2.value = 1;
      }
      break;
    case 'Back3':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        Location.value = 'Back4';
        act_item2 = 1;
      }
      break;
    case 'Basement1':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        Location.value = 'Basement2';
      }
      break;
    case 'Basement2':
      changeShow('Basement3')
      break;
    case 'Basement3':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        changeShow('Basement4');
      }
      break;
    case 'Basement4':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        Location.value = 'Basement5';
      }
      break;
    case 'Basement5':
      changeShow('Basement6')
      break;
    case 'Basement6':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        Location.value = 'Basement7';
      }
      break;
    case 'Basement7':
      changeShow('Basement8')
      break;
    case 'Basement9':
      changeShow('Basement10')
      break;
    case 'Basement10':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
      } else {
        Location.value = 'Basement11';
      }
      break;
    case 'Outside1':
      if (LineIndex < storyLines.value.length) {
        displayNextLine()
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
      } else {
        if (endflg == 1) {
          changeShow('Outside2')
        }
      }
      break;
    default:
  }
}
// 場面転換の初期処理
function initChange() {
  clearTimeout(timeId);
  clearInterval(txtInterval);
  // window.speechSynthesis.cancel();
  showHorror.value = 0;
  txt_story.value = ['']
  LineIndex = 0;
}
// 音声ゲット
function get_Voice() {
  var voice = speechSynthesis.getVoices().find(function (voice) {
    // console.log(voice.name);
    return voice.name === 'Microsoft Ichiro - Japanese (Japan)';
  });
  // 取得できた場合のみ適用する
  if (voice) {
    uttr.voice = voice;
  }
}
// テキスト読込
function loadStory(txt) {
  // 改行コードを統一
  let text = txt.replace(/\r\n|\r/g, '\n');
  // 改行ごとに分割して配列に格納
  let fileLines = text.split('\n');
  // linesを更新
  storyLines.value = fileLines;
}

// 画面をクリックする毎に次の行を表示
function displayNextLine() {
  // 1行目の場合
  if (txt_story.value == '') {
    readStory(storyLines.value[LineIndex])
  } else {
    // 空行は改行コードのみ
    // if (storyLines.value[LineIndex] == '') {
    //   txt_story.value[LineIndex] = '\n';
    // }
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
// テキスト表示
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

// 場面転換
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

// 音楽再生
function changeMsc(msc) {
  msc_back.src = msc;
  msc_back.play();
}
// ギャーのアニメーション
function anime_Horror(image) {
  // back_image.value = "url(" + image + ")";
  src_horror.value = image
  anime({
    targets: '.img-horror',
    // targets: img-obj,
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
    Location.value = 'ReEnter';
  }, 7500);
}

onMounted(() => {
  // get_Voice();
  // ページ読み込み完了時
  window.onload = () => {
    alert(msg_alert)
  }
});

</script>

<style>
body {
  font-family: "ふぉんとうは怖い明朝体";
  background-color: #150813;
  /* max-width: 1000px; */
}

.background {
  background-image: v-bind(back_image);
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
  /* text-align: left; */
  color: lightsteelblue;
  overflow: hidden;
  white-space: pre-wrap;
}

.txt-story {
  margin: auto;
  max-width: 800px;
}

.img-horror {
  /* margin-top: 10vh; */
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
  /* transform: translateY(-50%) translateX(-50%); */
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
  /* height: 100%; */
  /* width: 100%; */
}

/* タイトル */
.main-title {
  font-family: "Segoe Script";
  margin: auto;
  /* white-space: nowrap; */
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
  /* overflow: hidden; */
  /* word-break: normal; */
  font-weight: bold;
  animation: main-title 10s linear;
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
.btn-1 {
  width: 250px;
  padding: 3px;
  font-size: 36px;
  /* font-weight:bold; */
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

.btn-1:hover {
  /* box-shadow: 0 0 10px 4px maroon; */
  background: #150813;
}

#btn-a {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  animation: show 1.5s;
}

#btn-b {
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  animation: show 1.7s;
}

#btn-c {
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
    /* transform: skew(100deg, 100deg); */
  }

  100% {
    opacity: 1;
  }
}
</style>