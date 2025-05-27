<script lang="ts" setup></script>

<template>
  <div class="chat-bubble">
    <div class="typing">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-bubble {
  width: fit-content;
  background-color: #efefef;
  padding: 8px 16px;
  -webkit-border-radius: 16px;
  -webkit-border-bottom-left-radius: 2px;
  -moz-border-radius: 16px;
  -moz-border-radius-bottomleft: 2px;
  border-radius: 16px;
  border-bottom-left-radius: 2px;
  display: inline-block;
}
.typing {
  align-items: center;
  display: flex;
  height: 17px;
}
.typing .dot {
  animation: mercuryTypingAnimation 1.8s infinite ease-in-out;
  background-color: #1e394f; //rgba(20,105,69,.7);
  border-radius: 50%;
  height: 7px;
  margin-right: 4px;
  vertical-align: middle;
  width: 7px;
  display: inline-block;
}
.typing .dot:nth-child(1) {
  animation-delay: 200ms;
}
.typing .dot:nth-child(2) {
  animation-delay: 300ms;
}
.typing .dot:nth-child(3) {
  animation-delay: 400ms;
}
.typing .dot:nth-child(3) {
  animation-delay: 500ms;
}
.typing .dot:last-child {
  margin-right: 0;
}

@keyframes mercuryTypingAnimation {
  0% {
    transform: translateY(0px);
    background-color: #3abff8; // rgba(20,105,69,.7);
  }
  28% {
    transform: translateY(-7px);
    background-color: #8adbfd; //rgba(20,105,69,.4);
  }
  44% {
    transform: translateY(0px);
    background-color: #bde1f1; //rgba(20,105,69,.2);
  }
}
</style>
