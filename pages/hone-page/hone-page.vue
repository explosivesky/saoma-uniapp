<template>
  <view>
    <!-- 顶部 -->
    <view class="top-view">
      <view>{{diners}}人就餐</view>
      <view class="top-view-flex">
        <image src="/static/tab/fenxiang.svg" mode="widthFix" class="top-search"></image>
        <image src="/static/tab/dingdan.svg" mode="widthFix" @click="goToMyOrder"></image>
      </view>
    </view>
    <!-- 点餐界面 -->
    <view class="order-view">
      <view class="commodity">
        <!-- 左 -->
        <view class="order-left">
          <scroll-view scroll-y="true" class="scroll-Hei" :scroll-with-animation="true" :enhanced="true" :show-scrollbar="false" >
			<block v-for="(item,i) in cate" :key='i'>
				<view class="itemize-text"  @click="handle(i,item.cid)" :class="{active:i==currentIndex}">
				  <text>{{item.category}}</text>
				  <block v-if="item.sele_quantity > 0"> <text>{{item.sele_quantity}}</text></block>
				</view>
			</block>
          </scroll-view>
        </view>
        <!-- 右 -->
        <view class="order-right">
          <scroll-view scroll-y="true" class="scroll-Hei" :scroll-with-animation="true" :enhanced="true" :show-scrollbar="false"  @scroll="scroLl" :scroll-into-view="scroll_into"> 
           <block v-for="(item,i) in goods" :key='i'>
			   <view class="rig-height" :id="item.cid">
			     <view class="classif">{{item.category}}</view>
			     <view class="classif-goods" @click="detail(true,detail,goods_index,item.cid,i)" v-for="(detail,goods_index) in item.query" :key='goods_index'>
			       <view class="goods-image">
			         <image :src="detail.image[0].url" mode="aspectFill"></image>
			       </view>
			       <view class="goods-Price">
			         <view class="goods-name">
			           <text class="Bold">{{detail.name}}</text>
			           <text class="Thinning">已售 {{detail.shopsell}}</text>
			         </view>
			         <view class="unit-price">
			           <text class="Symbol">¥</text>
			           <text class="Bold">{{detail.signprice}}</text>
			           <text class="Thinning">/{{detail.unit}}</text>
			         </view>
			       </view>
			       <view class="quantity">
			         <view>
			           <image src="/static/tab/jianhao.png" mode="widthFix" v-if="detail.quantity > 0" @click.stop="decr(i,goods_index,item.cid,detail)"></image>
			         </view>
			         <view><text v-if="detail.quantity > 0">{{detail.quantity}}</text></view>
			         <view>
			           <image src="/static/tab/jia.png" mode="widthFix" @click.stop="plus(i,goods_index,item.cid,detail)"></image>
			         </view>
			       </view>
			     </view>
			   </view>
		   </block>
            <view style="height: 400rpx;"></view>
          </scroll-view>
        </view>
      </view>
      <!-- 底部 -->
      <view class="order-bottom" :style="{'padding-bottom':iphongCheck==true ? '50rpx':''}" @click="bottom">
        <view class="Shopping" style="width: 115rpx;">
          <view class="Shopping-left">
            <image src="/static/tab/gouwuche.png" mode="widthFix"></image>
          </view>
          <view class="Shopping-number" v-if="countTotal > 0">{{countTotal}}</view>
        </view>
        <view class="Shopping-title">已点{{countTotal}}份菜品</view>
        <view class="place-order">
          <button plain="true" open-type="getUserInfo" @click.stop="subscription">选好了</button>
        </view>
      </view>
    </view>
    <!-- 单个商品详情 -->
    <Details v-if="popupitem" :popup="popup"></Details>
    <!-- 购物车 -->
    <Cart v-if="card" :shopping_card="shopping_card"></Cart>
	<!-- 骨架屏 -->
	<home v-if="isShow"></home>
  </view>
</template>

<script>
// 单个商品详情
import Details from './components/goods-details.vue'
// 购物车
import Cart from './components/shopping-cart.vue'
//生成订单编号
import {orderCode} from '../../utils/placeOrderCode.js'
//骨架屏
import home from '../skeleton/home.vue'
export default {
  components: { Cart ,Details,home},
  data () {
    return {
      scroll_into: '',//点击指示到谁
      card: false,//购物车隐藏与否
      popupitem: false,//单个商品隐藏与否
	  goods:[],//响应商品数据
	  cate:[],//响应分类数据
	  currentIndex:0,//当前索引
	  heightList:[],//记录每个 右侧 盒子的高度
	  shopping_card:[],//购物车的数据
	  popup:{},//商品弹窗数据
	  tmplIds:'Z-i5aHP8zP3HNO4MyeoNK9OY9_LfvT6t36Veg3oTbK8',//订阅消息模板ID
	  diners:wx.getStorageSync('diners'),
	  iphongCheck:getApp().globalData.iphongCheck,
	  isShow:true
    }
  },
  methods: {
 async getData(){
	 //获取菜品数据
	 let uid = wx.getStorageSync('uid');
	 let res = await new this.$Requst('/uniapp/getDishes', 'POST', { uid }).req();
	 this.goods=res.data.data.response.res_data
	 this.cate=res.data.data.response.res_cate
  },//左右联动
  scroLl(event){
	  let scrollTop=event.detail.scrollTop
	  if(scrollTop >= this.scrollTop){
		  //下拉
		  if(scrollTop >= this.heightList[this.currentIndex]){
			  this.currentIndex +=1
		  }
	  }else{
		  //上拉
		  //1  - 103
		  if(scrollTop < this.heightList[this.currentIndex-1]){
			  this.currentIndex -=1
		  }
	  }
	  //全局记录一下
	  this.scrollTop=scrollTop
  },
  //商品 加一
	 plus(i,goods_index,cid,detail){
		 let{quantity,image,name,signprice,unit,id}=detail
		let Qu = quantity+1
		this.$set(this.goods[i].query[goods_index],'quantity',Qu)
		//给购物车准备数据
		let obj={i,image,name,signprice,unit,id,cid,goods_index,quantity:Qu,total_price:Qu*signprice}
		this.shopping_cart(obj)
	 } ,
	 //商品减一
	 decr(i,goods_index,cid,detail){
		let{quantity,image,name,signprice,unit,id}=detail
		 let Qu=quantity - 1
		 this.$set(this.goods[i].query[goods_index],'quantity',Qu)
		 let obj={i,image,name,signprice,unit,id,cid,goods_index,quantity:Qu,total_price:Qu*signprice}
		 this.shopping_cart(obj)
	 },
	 //添加购物车
	 shopping_cart(obj){
		 /**
		  * 如果数组为空 ? 直接添加 : 判断 id 是否相同，相同就 更新视图层
		  * */ 
		 if(!this.shopping_card.length){
			 this.shopping_card.unshift(obj)
		 }else{
		  let res = this.shopping_card.findIndex(i=>i.id==obj.id)
		  //菜品存在
		  if(res != -1){
			  //更新视图层
			  this.$set(this.shopping_card[res],'quantity',obj.quantity)
			  this.$set(this.shopping_card[res],'total_price',obj.total_price)
		  }else{
			  //不存在
			  this.shopping_card.unshift(obj)
		  }
		 }
		 this.left_quantity()
	 },
	 //计算左边各类下添加了多少类
	 left_quantity(){
		 //数组去重的方式写的
		 let obj={}
		 let arr=[]
		this.shopping_card.forEach((i,ind)=>{
			if(obj[i.cid]){
				arr.forEach(item=>{
					if(item.cid==i.cid){
						item.value += i.quantity
					}
				})
			}else{
				obj[i.cid]=true
				arr.push({'cid':i.cid,'value':i.quantity})
			}
		})
		 arr.forEach(item=>{
				 let index = this.cate.findIndex(itemSub=>item.cid == itemSub.cid)
				 this.$set(this.cate[index],'sele_quantity',item.value)
		 })
		 //原方法
		//  let obj={}
		//  //shopping_card vue全局保存了
		// shopping_card.forEach(i=>{
		// 	if(!obj[i.cid]){
		// 		obj[i.cid]=i.quantity //{'c12313':quantity}
		// 	}else{
		// 		obj[i.cid]+=i.quantity
		// 	}
		// })
		// // console.log(obj)//{c1636614024836: 2, c1636614118528: 1}
		//  let m=[]
		//  for(let i in obj){
		// 	 m.push({'cid':i,'value':obj[i]})
		//  }
		//  // console.log(m)//[0:{cid: "c1636614024836", value: 2},1: {cid: "c1636614118528", value: 1}]
		//  m.forEach(item=>{
		// 	 let index = this.cate.findIndex(itemSub=>item.cid == itemSub.cid)
		// 	 this.$set(this.cate[index],'sele_quantity',item.value)
		//  })
	 },
	 //绑定 currentindex
  handle(index,cid){
	  this.currentIndex=index
	  this.scroll_into= cid
	  setTimeout(()=>{
		  this.scroll_into=''
	  },150)
  },
  //控制 购物车显示
  bottom(value = true){
	  this.card=value
  },
  //给购物车组件调用的方法
  cartCtrl(index,Qu,item){
	  let{signprice,i,goods_index,cid}=item
	  this.$set(this.shopping_card[index],'quantity',Qu)
	  this.$set(this.shopping_card[index],'total_price',Qu * signprice)
	  this.$set(this.goods[i].query[goods_index],'quantity',Qu)
	  //更新左边商品数量视图层
	  this.left_quantity()
  },
  //清空列表
  empty(){
	  this.shopping_card=[]
	  this.cate.forEach(i=>{
		  i.sele_quantity = 0
	  })
	  this.goods.forEach(i=>{
		  i.query.forEach(iSub=>{
			  iSub.quantity=0
		  })
	  })
  },
  //商品详情弹窗
  detail(value=true,detail,goods_index,cid,i){
	  this.popupitem = value
	  //如果是 弹窗调用就没必要过去当前商品 数据了
	  if(value == false)return
	  detail.goods_index=goods_index
	  detail.i=i
	  detail.cid=cid
	  this.popup = detail
  },
  //订阅消息
subscription(){
	//过滤到 价格 为 0 的菜品(因为之前数量 = 0 的数据没删除)
	let res = this.shopping_card.filter(i=>{
			  return i.total_price != 0
	})
	//防止用户没选菜品 直接点餐
	if(res.length==0){
		wx.showToast({
		  title: '请选择菜品',
		  icon: 'error',
		  duration: 2000
		})
		return
	}
	//订阅消息
	wx.requestSubscribeMessage({
	  tmplIds: [this.tmplIds],
	  success: (result) =>{
		  this.placeAnOrder(res)
	  },
	  fail:(err)=>{
		  console.log(err)
	  }
	})

},
  //提交订单到数据库
  async placeAnOrder(res){
	  //loading组件
	  wx.showLoading({
	    title: '提交中，请稍后',
		mask:true
	  })
	  let settle_amount = 0
	  //金额总数相加
	  res.forEach(i=>{
		  settle_amount += i.total_price
	  })
	  //获取 openid
	  let openId = wx.getStorageSync('openid')
	  let uid = wx.getStorageSync('uid');
	  let table_number=wx.getStorageSync('table_num');
	  let number_of_diners=wx.getStorageSync('diners')
	  let order={
		  table_number,
		  uid,
		  openId,
		  number_of_diners,
		  order_time:this.$moment().utcOffset(8).format('YY-MM-DD HH:mm:ss'),
		  settle_amount,
		  order_num:orderCode(),
		  transaction_status:'unsettle',
		  order_receiving:'miss_order',
		  menu:[{backup:'备用字段',goods_list:res}]
	  }
	  //发送订单
	  let resule = await new this.$Requst('/uniapp/submitDishes', 'POST', order).req();
	//发送消息给 后台管理页面
	var pubsub = this.$goeasy.pubsub;
	pubsub.publish({
	    channel: "my_channel",//替换为您自己的channel
	    message: wx.getStorageSync('uid'),//替换为您想要发送的消息内容
	    onSuccess:function(){
	        console.log("消息发布成功。");
	    },
	    onFailed: function (error) {
	        console.log("消息发送失败，错误编码："+error.code+" 错误信息："+error.content);
	    }
	});
	//跳转到订单页面
	wx.redirectTo({
	  url: '../order-detail/order-detail?val=1'
	})
  },
  //跳转到我的订单页面
  goToMyOrder(){
	  //两个页面没关联，所以保留当前页面，跳转到应用内的某个页面
	  wx.navigateTo({
		  url:'../my-order/my-order'
	  })
  }
},
  onLoad () {
	this.getData()
  },
  mounted(){
	  //获取 每个 分类的元素高度
		setTimeout(()=>{
			let height=0
			const query = uni.createSelectorQuery()
				    // select 默认只选中一个元素  而 rig-height v-for 遍历了好几个
				    //而 selectAll 选中所有元素 
				    query.selectAll('.rig-height').boundingClientRect()
				    query.exec((res)=>{
						res[0].forEach(i=>{
							height += i.height
							this.heightList.push(height)
						})
				    })
					this.isShow=false
		},100)
  },
  computed:{
	  //计算点餐总数
	  countTotal(){
		  let count=0
		  this.shopping_card.forEach(i=>{
				  count += i.quantity
		  })
		  return count
	  }
  }
}
</script>

<style scoped>
.top-view {
  background: linear-gradient(
    to bottom,
    #f7d45f,
    #f7d562,
    #f8d561,
    #f9db76,
    #f9de80
  );
  height: 120rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
}
.top-view image {
  display: block;
  width: 35rpx;
  height: 35rpx;
}
.top-view-flex {
  display: flex;
  align-items: center;
}
.top-search {
  padding-right: 50rpx;
}
/* 点餐界面 */
.order-view {
  margin-top: 120rpx;
}
.commodity {
  display: flex;
  position: fixed;
  top: 120rpx;
  left: 0;
  right: 0;
}
.order-left {
  background-color: #fafafa;
  width: 150rpx;
  overflow-y: auto;
}
.itemize-text {
  font-size: 27rpx;
  padding: 30rpx 10rpx;
  display: flex;
  align-items: center;
  color: #797979;
}
.itemize-text text:nth-child(1) {
  flex: 1;
}
.itemize-text text:nth-child(2) {
  background-color: #eb5941;
  border-radius: 50%;
  font-size: 20rpx;
  color: #ffffff;
  width: 30rpx;
  height: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 2rpx;
}
.scroll-Hei {
  height: 100vh;
  /* white-space: nowrap; */
}
.order-right {
  background-color: #ffffff;
  flex: 1;
  overflow-y: auto;
}
.classif {
  font-size: 27rpx;
  padding: 30rpx 20rpx;
  color: #797979;
}
/* 分类商品 */
.classif-goods {
  display: flex;
  justify-content: space-between;
  padding: 0 20rpx;
  height: 150rpx;
  font-size: 30rpx;
  margin-bottom: 45rpx;
}

.goods-image image {
  display: block;
  width: 150rpx;
  height: 150rpx;
  border-radius: 10rpx;
}
.goods-Price {
  flex: 1;
  position: relative;
  padding: 0 20rpx;
}
.goods-Price text {
  display: block;
}
.goods-name {
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
}
.goods-name text:nth-child(1) {
  padding-bottom: 9rpx;
}
.unit-price {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: baseline;
}
.Bold {
  font-weight: bold;
}
.Symbol {
  font-size: 20rpx;
}
.Thinning {
  font-size: 25rpx;
  color: #cccccc;
}
.quantity image {
  width: 50rpx;
  height: 50rpx;
}
.quantity view {
  width: 50rpx;
  height: 50rpx;
  text-align: center;
  line-height: 50rpx;
}
.quantity {
  display: flex;
  align-items: center;
  align-self: flex-end;
  width: 200rpx;
  justify-content: space-between;
}
.order-bottom {
  background-color: #fefefe;
  height: 120rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0rpx -1.9rpx 1rpx 1rpx #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  z-index: 9;
}
.Shopping image {
  width: 75rpx;
  height: 75rpx;
  display: block;
}
.Shopping-left {
  width: 75rpx;
  height: 75rpx;
}
.Shopping {
  display: flex;
  align-items: center;
  /* height: 120rpx; */
}
.Shopping-number {
  align-self: flex-start;
  background: #eb5941;
  color: #ffff;
  width: 40rpx;
  border-radius: 50rpx;
  text-align: center;
  font-size: 20rpx;
  /* margin-top: 15rpx; */
}
.Shopping-title {
  flex: 1;
  padding: 0 25rpx;
  color: #999999;
  /* height: 120rpx;
	line-height: 120rpx; */
}
.place-order button {
  border: none;
  background: linear-gradient(to right, #f8da81, #f8d771, #f7d362, #f6cb4a);
  width: 200rpx;
  height: 75rpx;
  line-height: 75rpx;
  border-radius: 50rpx;
  font-weight: bold;
  z-index: 9;
}
/* 点击分类列表加上背景色 */
.active {
  background-color: #ffffff;
  color: #000000 !important;
}
</style>
