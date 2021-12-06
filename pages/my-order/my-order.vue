<template>
	<view class="wrap">
		<!-- 订单项 -->
		<block v-for="(item,index) in totalOrder" :key="index">
			<view class="order" @click="orderDetail(item.transaction_status)">
				<view class="title" >
					<text>小袁烧烤</text>
					<view :style="{color:style(item.transaction_status)}">
						<text>{{item.transaction_status== "settled"?"已完成":"待结账"}}</text>
					</view>
				</view>
				<view class="order-info">
					<view class="left">
						<text>桌台名称 : {{item.table_number}}</text>
						<text>下单时间 : {{item.order_time}}</text>
					</view>
					<view class="right">
						<text>￥{{item.settle_amount | float}}</text>
					</view>
				</view>
			</view>
		</block>
		<view style="height: 300rpx;"></view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				totalOrder:[]
			}
		},
		methods:{
			//获取所有订单
			async getOrder(){
				let openid=wx.getStorageSync('openid')
				let uid = wx.getStorageSync('uid')
				let res = await new this.$Requst('/order/getorderByOpenId', 'POST', {openid,uid}).req();
				this.totalOrder=res.data.result
			},
			orderDetail(state){
				let val = state =='settled' ? 0 : 1
				//跳转到 订单详情页面
				wx.redirectTo({
				  url: '../order-detail/order-detail?val='+val
				})
			},
		},
		filters:{
			float(val){
				return parseFloat(val).toFixed(2) 
			}
		},
		computed:{
			style(state){
				return (val)=>{
					return val=="settled"?"":"#F32121"
				}
			}
		},
		onLoad(){
		this.getOrder()
		}
	}
</script>

<style>
	page{background-color: #f4f4f4;}
	.wrap{
		padding: 10rpx 20rpx;
		font-size: 28rpx;
	}
	.order{
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-bottom: 10rpx;
	}
	.title{
		display: flex;
		justify-content: space-between;
		padding-bottom: 10rpx;
		border-bottom: 2rpx solid #cfcfce;
		font-size: 26rpx;
	}
	.title :nth-child(1){
		font-weight: bold;
		font-size: 30rpx;
	}
	.order-info{
		color: #cfcfce;
		display: flex;
		padding-top: 10rpx;
		justify-content: space-between;
	}
	.left :nth-child(1){
		display: block;
		padding-bottom: 10rpx;
	}
	.right{
		display: flex;
		align-items: center;
		color:#000000;
		font-weight: bold;
	}
</style>
