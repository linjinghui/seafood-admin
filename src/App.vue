<template>
  <div id="app">
    <router-view></router-view>
    <loading v-model="optionLoading.show" v-bind="optionLoading"></loading>
    <tip v-model="optionTip.show" v-bind="optionTip"></tip>
    <confirm v-bind="optionConfirm" v-model="optionConfirm.show">
      <span slot="title" v-html="optionConfirm.heading"></span>
      <span slot="content" v-html="optionConfirm.content"></span>
    </confirm>
    <prompt v-bind="optionPrompt" v-model="optionPrompt.show">
      <span slot="title" v-html="optionPrompt.heading"></span>
    </prompt>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'app',
    data: function () {
      return {
        swidth: document.documentElement.clientWidth || document.body.clientWidth,
        sheight: document.documentElement.clientHeight || document.body.clientHeight,
        optionLoading: {
          show: false,
          text: '请您稍后！',
          modal: false,
          full: false
        },
        optionTip: {
          show: false,
          // left|center
          textAlign: '',
          // primary|success|info|warning|danger|自定义
          theme: 'success'
        },
        optionPrompt: {
          show: false,
          modal: true,
          heading: '标题',
          stl: {
            footer: {
              // left|center|right
              'text-align': 'right'
            }
          },
          buttons: [{
            text: '取消',
            // primary|success|info|warning|danger|#f56c6c
            theme: 'line'
          }, {
            text: '确认',
            theme: 'success'
          }]
        },
        optionConfirm: {
          show: false,
          modal: false,
          heading: '标题',
          content: '文本内容',
          // error|success|warning
          type: 'success',
          stl: {
            header: {
              // left|center
              'text-align': 'center'
            },
            section: {
              // left|center|right
              'text-align': 'center'
            },
            footer: {
              // left|center|right
              'text-align': 'center'
            }
          },
          buttons1: [],
          buttons: [{
            text: '放弃修改',
            // primary|success|info|warning|danger|#f56c6c
            theme: 'line'
          }, {
            text: '修改',
            theme: 'warning'
          }]
        }
      };
    },
    mounted: function () {
      let _this = this;

      Vue.prototype.$loading = function (option) {
        _this.optionLoading = Object.assign(_this.optionLoading, option);
      };
      Vue.prototype.$tip = function (option) {
        _this.optionTip = Object.assign(_this.optionTip, option);
      };
      Vue.prototype.$confirm = function (option) {
        _this.optionConfirm = Object.assign(_this.optionConfirm, option);
      };
      Vue.prototype.$prompt = function (option) {
        _this.optionPrompt = Object.assign(_this.optionPrompt, option);
      };
    },
    watch: {
      //
    },
    methods: {
      toPage: function (path, type) {
        if (!path) {
          switch (type) {
            case 0:
              // 登录页
              path = '/#/';
              break;
            case 1:
              // 首页
              path = '/#/home';
              break;
            case 2:
              // 产品库管理
              path = '/#/home/product';
              break;
            case 3:
              // 订单管理
              path = '/#/home/order';
              break;
            case 4:
              // 备货区
              path = '/#/home/reservearea';
              break;
            case 5:
              // 送货区
              path = '/#/home/delivery';
              break;
            default:
              path = '/#/home';
          }
        }
        var search = location.href.split('?');

        if (search.length !== 2 || path === '/#/login') {
          search = '';
        } else {
          search = '?' + search[1];
        }
        window.location.href = location.href.split('/#/')[0] + path + search;
      },
      // 计算商品总价
      countMoney: function (data) {
        let money = '';

        try {
          money = data.count * data.price;
          money = money.toFixed(2);
        } catch (error) {
          // 
        }
        return money;
      }
    }
  };
</script>

<style type="text/css">
  #app {
    position: relative;
    width: 100%;
    height: 100%;
    /* min-width: 1350px;
    min-height: 630px; */
    overflow: auto;
    background-color: #fff;
    --theme: #0079ff;
  }

  /* 笔记本尺寸 1366 * 768 */
  @media screen and (max-width: 1366px) {}
</style>

<style type="text/css" lang="scss" class="webBaseui">
  @import '~@/style/theme.scss';
  
  .button {
    border-radius: 2px;
    background-color: $theme;
  }

  .input > input {
    border-color: #f4f6f8!important;
    border-top-width: 0!important;
    border-left-width: 0!important;
    border-right-width: 0!important;
  }

  .input > input:not([readonly]):focus {
    border-color: $theme!important;
  }

  // 时间插件
  .layui-laydate {
    .layui-laydate-footer span:hover,
    .layui-laydate-footer span[lay-type="date"] {
      color: $theme;
    }
    .laydate-day-mark::after {
      background-color: $theme;
    }
  }

  .wrap-menu > .line:active, 
  .wrap-menu > .line.active {
    color: $theme!important;
  }
</style>

<style lang="scss" class="cssForm">
  // 默认垂直布局
  .wrap-form {

    // 单层
    >.form-layer {

      >label {
        line-height: 30px;
      }
      >label.star:before {
        content: '*';
        color: red;
      }

      >.f-dom {
        display: inline-block;
        width: 100%;
      }

      >.tip {
        color: red;
        line-height: 20px;
      }
    }
    
    // 单层水平
    >.form-layer.horiz {
      position: relative;
      
      >label {
        display: inline-block;
        margin-right: 10px;
        width: 100px;
        text-align: right;
      }

      >.f-dom {
        width: calc(100% - 100px - 5px - 10px);
      }
    }
  }

  // 水平布局
  .wrap-form.horiz {

    // 单层
    >.form-layer {
      position: relative;
      margin-bottom: 14px;
      
      >label {
        display: inline-block;
        margin-right: 10px;
        width: 100px;
        text-align: right;
      }

      >.f-dom {
        width: calc(100% - 100px - 5px - 10px);
      }

      >.tip {
        position: absolute;
        top: 0;
        left: calc(100% + 10px);
        line-height: 30px;
        white-space: nowrap;
        word-wrap: break-word;
        word-break: normal;
        z-index: 1;
      }
    }

    // 单层垂直
    >.form-layer.vert {

      >label {
        display: unset;
        margin-right: unset;
        width: unset;
        text-align: unset;
      }

      >.f-dom {
        width: 100%;
      }

      >.tip {
        top: 30px;
      }
    }
  }
</style>

