<template>
  <view class="home">
    <view class="search-box">
      <u-row>
        <u-col span="1">
          <u-icon name="search" size="40" />
        </u-col>
        <u-col span="5">
          <text class="text-sm">搜索</text>
        </u-col>
      </u-row>
    </view>
    <yon-swiper />
    <view class="drugs-list-box">
      <text class="title">热销商品</text>
      <u-grid col="2.18">
        <u-grid-item
          v-for="item in 5"
          :key="item"
          customStyle="margin-right: 14px"
        >
          <view class="drug-item">
            <u-image
              width="100%"
              height="120px"
              showLoading
              lazy-load
              :src="drugCover"
            />
            <view class="drug-name">
              <text class="u-line-1">科星药业-替米考星预混剂500g装20%</text>
            </view>
            <view class="drug-desc">
              <text class="u-line-2"
                >描描述描述描述描述描述描述描述描述12321描描述描述描述描述描述描述描述描述12321述描描述描述描述描述描述描述描述描述12321述述</text
              >
            </view>
            <view class="drug-price-box">
              <view class="price">
                <text class="drug-sign">￥</text>
                <text class="drug-price">20</text>
              </view>
              <u-button
                customStyle="margin-left: 14px"
                size="small"
                text="立即购买"
                type="success"
              />
            </view>
          </view>
        </u-grid-item>
      </u-grid>
    </view>
  </view>
</template>

<script>
import yonSwiper from "./components/yon-swiper.vue";
import { queryGoodsList } from '../../api/goods/index';
export default {
  name: "Home",
  components: {
    yonSwiper,
  },
  data() {
    return {
      drugCover: "https://dummyimage.com/600x400/000/fff",
      searchParams: {
        page: 1,
        size: 10
      }
    };
  },
  methods: {
    async getGoodsList() {
      await queryGoodsList(this.searchParams)
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  .search-box {
    height: 30px;
    line-height: 30px;
    border-radius: 16px;
    text-align: center;
    font-size: 16px;
    color: #babbba;
    margin: 12px;
    padding: 0 12px;
    background-color: white;
  }
  .drugs-list-box {
    margin-left: 14px;
    margin-top: 14px;
    .title {
      font-size: 18px;
    }
    .drug-item {
      width: 100%;
      background-color: white;
      margin: 12px 0;
      padding-bottom: 10px;
      border-radius: 14px;
      box-shadow: 0 3px 14px -12px rgba(0, 0, 0, 30%);
      .drug-name {
        color: $u-main-color;
        font-size: 16px;
        padding: 10px 10px 0 10px;
      }
      .drug-desc {
        padding: 10px;
        color: $u-info;
        font-size: 13px;
      }
      .drug-price-box {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        .price {
          .drug-sign {
            font-size: 12px;
            color: red;
          }
          .drug-price {
            font-size: 18px;
            color: red;
          }
        }
      }
    }
  }
}
</style>
