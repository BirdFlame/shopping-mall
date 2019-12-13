<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl1" v-show="isTabFixed" class="tab-control"></tab-control>
    <Scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners='banners'/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl2"></tab-control>
      <goods-list :goods="goods[currentType].list"/>
    </Scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  //导航栏
  import NavBar from "../../components/common/navbar/NavBar";
  //轮播图
  import HomeSwiper from "./childComps/HomeSwiper";
  //推荐模块
  import RecommendView from "./childComps/RecommendView";
  //每周推荐模块
  import FeatureView from "./childComps/FeatureView";
  //选项卡
  import TabControl from "../../components/content/tabControl/TabControl";
  //商品列表
  import GoodsList from "../../components/content/goods/GoodsList";
  //数据请求
  import {getHomeMultidata, getHomeGoods} from "../../network/home";
  //滚动条
  import Scroll from "../../components/common/scroll/Scroll";
  //回到顶部
  import BackTop from "../../components/content/backTop/BackTop";
  import {debounce} from "../../common/untils";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,

    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop:0,
        isTabFixed:false
      }
    },
    created() {
      this.getHomeMultidata()
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
      //监听item中图片加载完成

    },
    mounted() {
      const refresh = debounce(this.$refs.scroll.refresh, 500)
      this.$bus.$on('itemImageLoad', () => {
        refresh()
      })

    },
    // updated() {
    //   console.log(this.$refs.tabControl.$el.offsetTop)
    // },
    methods: {
      /*事件监听相关方法*/
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      contentScroll(position) {
        // 1.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000
        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.$refs.tabControl2.$el.offsetTop;
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      /* 网络请求相关方法*/
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.data.banner.list
          this.recommends = res.data.data.recommend.list
        }).catch(err => {
          console.log(err)
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.data.list)
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp()
        }).catch(err => {
          console.log(err)
        })
      },
    }
  }
</script>

<style scoped>
  #home {
    position:relative;
    height: 100vh;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;
    /*position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;*/
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
