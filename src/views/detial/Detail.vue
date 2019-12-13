<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" :current-index="currentIndex" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-image="topImage" ref="base"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="Param"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from '../../network/detail'
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import Scroll from "../../components/common/scroll/Scroll";
  import GoodsList from "../../components/content/goods/GoodsList";
  import {debounce} from "../../common/untils";
  import BackTop from "../../components/content/backTop/BackTop";
  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailParamInfo,
      DetailGoodsInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      BackTop
    },
    data() {
      return {
        iid: null,
        topImage: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        detailParamInfo: 0,
        themeTops: [],
        getThemeTopY: null,
        currentIndex:0,
        isShowBackTop:false,
      }
    },
    methods: {
      detailImageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTops[index], 100)
      },
      contentScroll(position){
        //backtop
        this.isShowBackTop = (-position.y) > 1000
        //1.获取Y值
        let positionY=-position.y
        //2.对比
        if(positionY>=this.themeTops[3]){
          this.currentIndex=3;
          this.$refs.nav.currentIndex=this.currentIndex
        }else if(positionY>=this.themeTops[2]){
          this.currentIndex=2;
          this.$refs.nav.currentIndex=this.currentIndex
        }
        else if(positionY>=this.themeTops[1]){
          this.currentIndex=1;
          this.$refs.nav.currentIndex=this.currentIndex
        }else {
          this.currentIndex=0;
          this.$refs.nav.currentIndex=this.currentIndex
        }
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      addToCart(){
        //获取商品信息
        const product={}
        product.iid=this.iid
        product.image=this.topImage[0]
        product.title=this.goods.title
        product.desc=this.goods.desc
        product.price=this.goods.realPrice
        //添加到VueX
        this.$store.commit('addCart',product)
        console.log(product)
      }
    },
    created() {
      this.iid = this.$route.params.iid
      getDetail(this.iid).then(res => {
        const data = res.data.result;
        //1.获取轮播图片
        this.topImage = data.itemInfo.topImages
        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)
        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo;
        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        //6.获取评论数据
        if (data.rate.list) {
          this.commentInfo = data.rate.list[0];
        }
      }).catch(err => {
        console.log(err)
      })
      //7.获取推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.data.list
      }).catch(err => {
      })
      this.getThemeTopY = debounce(() => {
        this.$refs.scroll.refresh()
        this.themeTops = []
        this.themeTops.push(this.$refs.base.$el.offsetTop)
        this.themeTops.push(this.$refs.Param.$el.offsetTop)
        this.themeTops.push(this.$refs.comment.$el.offsetTop)
        this.themeTops.push(this.$refs.recommend.$el.offsetTop)
      },200)
    },
    mounted() {
      let refresh = debounce(this.$refs.scroll.refresh, 100)
      this.$bus.$on('detailImageLoad', () => {
        refresh()
      })
    }
  }

</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 93px);
  }
</style>