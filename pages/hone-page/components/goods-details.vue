<template>
	<view>
		<!-- 单个商品详情 -->
		<view id="shadow" class="details-back" @click="close"></view>
		<view class="goods-details coup-anim">
			<view class="goods-image">
				<image :src="popup.image[0].url" mode="aspectFill"></image>
				<image src="/static/tab/guanbi.png" @click.stop="close" mode="widthFix"></image>
			</view>
			<view class="details-padd">
				<view class="details-name">{{popup.name}}</view>
				<view class="details-Thinning">已售 {{popup.shopsell}}</view>
				<view class="describe">
					<view class="details-unit-price">
						<text>¥</text>
						<text>{{popup.signprice}}</text>
						<text>/{{popup.unit}}</text>
					</view>
					<view class="details-quantity">
						<view><image src="/static/tab/jianhao.png" v-if="popup.quantity > 0" @click.stop="sub"></image></view>
						<view><text v-if="popup.quantity > 0">{{popup.quantity}}</text></view>
						<view><image src="/static/tab/jia.png" @click.stop="add"></image></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	props:{
		popup:Object
	},
	methods:{
		//关闭弹窗
		close(){
		this.$parent.detail(false)
		},
		//商品+
		add(){
			let {i,goods_index,cid} = this.popup
			this.$parent.plus(i,goods_index,cid,this.popup)
		},
		//商品-
		sub(){
			let {i,goods_index,cid} = this.popup
		this.$parent.decr(i,goods_index,cid,this.popup)
		}
	}
}
</script>

<style scoped>
@import '../../../style/shadow.css';
.goods-image{
	width: 100%;
	height: 500rpx;
	position: relative;
}
.goods-image image:nth-child(1){
	display: block;
	width: 100%;
	height: 500rpx;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
}
.goods-image image:nth-child(2){
	display: block;
	width: 50rpx;
	height: 50rpx;
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	border-radius: 50%;
}
.details-padd{
	padding: 20rpx 20rpx 0 20rpx;
}
.describe{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.details-quantity image{
	width: 50rpx;
	height: 50rpx;
	display: block;
}
.details-quantity{
	display: flex;
	align-items: center;
	width: 200rpx;
	justify-content: space-between;
}
.details-name{
	font-size: 35rpx;
	font-weight: bold;
}
.details-Thinning{
	font-size: 30rpx;
	color: #a4a4a4;
	padding: 20rpx 0;
}
.details-unit-price{
	font-size: 30rpx;
	color: #ec702d;
	display: flex;
	align-items: baseline;
}
.details-unit-price text:nth-child(2){
	font-size: 35rpx;
}
.details-unit-price text:nth-child(3){
	color: #999999 !important;
}
</style>
