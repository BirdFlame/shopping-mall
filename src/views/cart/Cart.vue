<template>
  <div class="cart">
    <nav-bar class="navBar">
      <div slot="center">购物车({{cartCount}})</div>
    </nav-bar>
    <cart-list></cart-list>
    <BottomBar/>
  </div>
</template>

<script>
  import NavBar from "../../components/common/navbar/NavBar";
  import CartList from "./CartList";
  import BottomBar from "./BottomBar";

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      BottomBar
    },
    computed: {
      cartList() {
        return this.$store.getters.cartList
      },
      cartCount() {
        return this.$store.getters.cartCount
      }
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }

  .navBar {
    background-color: var(--color-tint);
    color: #ffffff;
  }
</style>
