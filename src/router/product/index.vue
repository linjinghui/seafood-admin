<template>
  <div class="page product">
    <div class="wrap-operation" v-if="pboption.totalSize>0">
      <cmp-button @click="clkNew">新增产品</cmp-button>
    </div>
    <div class="wrap-empty center-hv" v-if="pboption.totalSize===0">
      <i class="iconfont iconwushuju"></i>
      还未添加产品, 
      <cmp-button @click="clkNew">去添加</cmp-button>
    </div>
    <div class="wrap main" v-if="pboption.totalSize>0">
      <cmp-table v-bind="option" ref="rtable" @callback="callback">
        <tr slot="head">
          <td @click="clkOrder('name')">商品</td>
          <td @click="clkOrder('specsName')">规格</td>
          <td @click="clkOrder('specsPrice')">单价</td>
          <td @click="clkOrder('specsStock')">库存</td>
          <td @click="clkOrder('rebate')">折扣</td>
          <td @click="clkOrder('origin_place')">产地</td>
          <td @click="clkOrder('create_time')">添加时间</td>
          <td @click="clkOrder('status')">操作</td>
        </tr>
        <tr slot="body" slot-scope="props">
          <td><img class="pic" :src="props.item.avatar">{{props.item.name}}</td>
          <td>{{props.item.specsName}}</td>
          <td>{{props.item.specsPrice}}</td>
          <td :style="'color:'+(!props.item.specsStock?'#f56c6c':props.item.specsStock<=10?'#e6a23c':'')+''">{{props.item.specsStock||0}}</td>
          <td>{{props.item.rebate}}</td>
          <td>{{props.item.origin_place}}</td>
          <td>{{utlDateStr(props.item.create_time)}}</td>
          <td>
            <cmp-button theme="line" @click="clkMd(props.item)">修改</cmp-button>
            <cmp-button v-if="props.item.status===2" @click="clkSj(props.item)">上架</cmp-button>
            <cmp-button v-if="props.item.status===1" theme="warning" @click="clkXj(props.item)">下架</cmp-button>
            <cmp-button v-if="props.item.status===1&&!props.item.recommend" theme="success" @click="clkTj(props.item)">推荐</cmp-button>
            <cmp-button v-if="props.item.status===1&&props.item.recommend" theme="info" @click="clkQxtj(props.item)">取消推荐</cmp-button>
            <cmp-button theme="danger" @click="clkDel(props.item)">删除</cmp-button>
          </td>
        </tr>
      </cmp-table>
      <cmp-pagebar v-bind="pboption" v-model="pboption.index" @callback="cbkPagebar"></cmp-pagebar>
    </div>
    <cmp-info v-model="optionInfo.show" :data="optionInfo.data" @callback="cbkInfo"></cmp-info>
  </div>
</template>

<script>
  import {Table, Button, Pagebarpagesize} from 'web-base-ui';
  import {dataFormat} from 'web-js-tool';
  import Info from './info.vue';
  import {ajaxGetGoods, ajaxGetGoodInfo, ajaxUpperShelf, ajaxLowerShelf, ajaxGoodDel, ajaxGoodRecommend} from '~root/data/ajax.js';
  
  export default {
    name: 'Product',
    components: {
      'cmpTable': Table,
      'cmpButton': Button,
      'cmpPagebar': Pagebarpagesize,
      'cmpInfo': Info
    },
    data () {
      return {
        keyworld: '',
        option: {
          data: [],
          order: true
        },
        pboption: {
          theme: 'simple',
          // 当期页
          index: 1,
          // 总页数
          // totalPage: 1,
          pagesizes: [
            30, 50, 100
          ],
          pagesize: 30,
          totalSize: ''
        },
        optionInfo: {
          show: false,
          data: {}
        }
      };
    },
    watch: {},
    beforeDestroy () {
      window.EVENTBUS.$off('search', this.ckbSearch);
    },
    mounted () {
      this.getDataList();
      window.EVENTBUS.$on('search', this.ckbSearch);
    },
    methods: {
      cbkPagebar (data) {
        this.pboption.pagesize = data.pagesize;
        this.pboption.index = data.currentPage;
        this.getDataList();
      },
      ckbSearch (data) {
        this.keyworld = data;
        this.pboption.index = 1;
        this.getDataList();
      },
      clkOrder: function (orderBy) {
        this.$refs.rtable.setOrder(this.option.data, orderBy);
      },
      clkNew () {
        // 默认折扣，默认规格
        this.$set(this.optionInfo, 'data', {rebate: 10, specs: [{}]});
        this.$set(this.optionInfo, 'show', true);
      },
      clkMd (info) {
        let _this = this;

        ajaxGetGoodInfo(info, function (data) {
          data = data.result;
          data.label = data.label || [];
          _this.$set(_this.optionInfo, 'data', JSON.parse(JSON.stringify(data)));
          _this.$set(_this.optionInfo, 'show', true);
        });
      }, 
      clkSj (info) {
        let _this = this;
        
        ajaxUpperShelf(info, function (data) {
          // 设置状态为已上架
          info.status = 1;
          _this.$tip({ show: true, text: '上架成功', theme: 'success' });
        });
      }, 
      clkXj (info) {
        let _this = this;
        
        this.$confirm({
          show: true,
          modal: true,
          heading: '提示',
          content: ' 确定下架该商品？',
          type: 'warning',
          stl: {
            header: {'text-align': 'center'},
            section: {'text-align': 'center'},
            footer: {'text-align': 'center'}
          },
          buttons: [{text: '取消', theme: 'line'}, {text: '确定', theme: '#2b8aff'}],
          callback: function (data) {
            _this.$confirm({ show: false });
            if (data.text === '确定') {
              ajaxLowerShelf(info, function (data) {
                // 设置状态为已下架
                info.status = 2;
                _this.$tip({ show: true, text: '下架成功', theme: 'success' });
              });
            }
          }
        });
      }, 
      clkDel (info) {
        let _this = this;
        
        this.$confirm({
          show: true,
          modal: true,
          heading: '提示',
          content: ' 确定删除该商品？',
          type: 'warning',
          stl: {
            header: {'text-align': 'center'},
            section: {'text-align': 'center'},
            footer: {'text-align': 'center'}
          },
          buttons: [{text: '取消', theme: 'line'}, {text: '确定', theme: '#2b8aff'}],
          callback: function (data) {
            _this.$confirm({ show: false });
            if (data.text === '确定') {
              ajaxGoodDel(info, function (data) {
                _this.getDataList();
                _this.$tip({ show: true, text: '删除成功', theme: 'success' });
              });
            }
          }
        });
      },
      clkTj (info) {
        let _this = this;

        ajaxGoodRecommend({id: info._id, recommend: true}, function (data) {
          // 设置推荐状态为已推荐
          info.recommend = true;
          _this.$tip({ show: true, text: '商品推荐成功', theme: 'success' });
        });
      },
      clkQxtj (info) {
        let _this = this;

        ajaxGoodRecommend({id: info._id, recommend: false}, function (data) {
          // 设置推荐状态为已取消推荐
          info.recommend = false;
          _this.$tip({ show: true, text: '商品已取消推荐', theme: 'success' });
        });
      },
      getDataList () {
        let _this = this;

        ajaxGetGoods({name: _this.keyworld, page: _this.pboption.index, size: _this.pboption.pagesize}, function (data) {
          let arr = data.result.list;

          for (let i = 0;i < arr.length;i++) {
            arr[i].specsName = arr[i].specs[0].name;
            arr[i].specsPrice = arr[i].specs[0].price;
            arr[i].specsStock = arr[i].specs[0].stock;
          }
          _this.$set(_this.option, 'data', arr);
          _this.$set(_this.pboption, 'totalSize', data.result.total);
          // _this.$set(_this.pboption, 'totalPage', parseInt((data.total - 1) / _this.pboption.pagesize) + 1);
        });
      },
      cbkInfo (data) {
        this.getDataList();
      },
      utlDateStr (data) {
        return dataFormat(new Date(data), 'yyyy-MM-dd hh:mm');
      }
    }
  };
</script>

<style lang="scss">
  .product {
    .wrapper-pagebar-pagesize .wrap-menu {
      top: calc(-100% - 50px) !important;
    }
    .wrap-table td:last-of-type {
      width: 300px;
    }
  }
</style>
<style scoped lang="scss">
  @import '~@/style/theme.scss';

  .page {

    > .wrap.main {
      height: calc(100% - 40px - 5px);
    }

    .wrap-table {
      height: calc(100% - 50px);

      // td:nth-of-type(1),
      td:nth-of-type(1) {
        width: 20%;
      }
    }

    .pic {
      margin-right: 5px;
      width: 40px;
      height: 40px;
      vertical-align: middle;
    }

    .button {
      margin-right: 5px;
      background-color: $theme;
    }

    .wrapper-pagebar-pagesize {
      padding: 10px;
    }
  }
</style>