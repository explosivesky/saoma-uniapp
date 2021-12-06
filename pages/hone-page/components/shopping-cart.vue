<template>
	<!-- 购物车 -->
	<view>
		<view class="details-back" @click="close"></view>
		<view class="goods-details coup-anim">
			<view class="empty" @click="empty">
				<image src="/static/tab/qingkong.svg" mode="widthFix"></image>
				<text>清空已点</text>
			</view>
			<!-- 商品列表 -->
		<block v-for="(item,index) in shopping_card" :key="index">
			<view class="goods-list" v-if="item.quantity > 0">
				<view class="goods-list-image"><image :src="item.image[0].url" mode="aspectFill"></image></view>
				<view class="goods-list-name">
					<view>{{item.name}}</view>
					<view class="list-text">
						<text>¥</text>
						<text>{{item.total_price}}</text>
					</view>
				</view>
				<view class="goods-quantity">
					<view><image src="/static/tab/jianhao.png" mode="widthFix" @click="sub(index,item)"></image></view>
					<view>{{item.quantity}}</view>
					<view><image src="/static/tab/jia.png" mode="widthFix" @click="add(index,item)"></image></view>
				</view>
			</view>
		</block>
			<view style="height: 100rpx;"></view>
		</view>
	</view>
</template>

<script>
export default{
	data() {
		return {
		}
	},
	props:{
		shopping_card:{
			type:Array,
			default(){
				return[]
			}
		}
	},
	methods:{
		//关闭购物车
		close(){
			this.$parent.bottom(false)
		},
		//商品 +
		add(index,item){
		let{quantity}=item
			let Qu = quantity + 1
			 this.$parent.cartCtrl(index,Qu,item)
		},
		//商品-
		sub(index,item){
			let{quantity}=item
			let Qu = quantity - 1
			 this.$parent.cartCtrl(index,Qu,item)
		}
		,
		//清空列表
		empty(){
			this.$parent.empty()
		}
	}
}
</script>

<style scoped>
@import '../../../style/shadow.css';
.empty image{
	width: 25rpx;
	height: 25rpx;
	display: block;
	padding-right: 10rpx;
}
.empty{
	font-size: 25rpx;
	color: #aaaaaa;
	height: 90rpx;
	border-bottom: 1rpx solid #f2f2f2;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin: 0 20rpx;
}
.goods-list-image image{
	display: block;
	width: 130rpx;
	height: 130rpx;
	border-radius: 10rpx;
}
.goods-quantity image{
	display: block;
	width: 50rpx;
	height: 50rpx;
}
.goods-quantity{
	display: flex;
	align-items: center;
	align-self: flex-end;
	width: 200rpx;
	justify-content: space-between;
}
.goods-list{
	display: flex;
	justify-content: space-between;
	padding: 0 20rpx;
	height: 130rpx;
	font-size: 30rpx;
	margin: 25rpx 0 45rpx 0;
}
.goods-list-name{
	flex: 1;
	position: relative;
	padding: 0 20rpx;
}
.list-text text{
	display: block;
}
.list-text{
	display: flex;
	/* align-items: center; */
	position: absolute;
	bottom: 0;
}
.list-text text:nth-child(1){
	font-size: 25rpx;
	padding-right: 5rpx;
}
</style>
