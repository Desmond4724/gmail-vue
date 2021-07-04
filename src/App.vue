<template>
<ul class="navigation">
  <li class="active">1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
</ul>
</template>


<style>

.navigation {
  padding-top: 50px;
  padding-left: 10px;
  width: 80px;
  background: grey;
  border-right: 20px solid #4FC3F7;
}

.navigation li {
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 20px;
}

.navigation li.active {
  background: #4FC3F7;
  position: relative;
}

.navigation li.active:before {
  content: '';
  position: absolute;
  top: -30px;
  width: 30px;
  height: 30px;
  background: transparent;
  border-radius: 20px;
  box-shadow: 15px 15px  #4FC3F7;
}

.navigation li.active:after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -30px;
  width: 30px;
  border-radius: 50%;
  height: 30px;
  background: transparent;
  box-shadow: 15px -15px   yellow;
}
</style>