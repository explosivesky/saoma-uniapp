<template>
	<view class="details-view">
		<view class="order-top">
			<view class="order-remind">
				<view>下单成功，坐等开吃</view>
				<view>菜品已在制作中</view>
			</view>
		</view>
		<view class="food-list">
			<block v-for="(item, index) in firstThree" :key="index">
				<view class="foot-back">
					<view class="foot-til">
						<text>第{{ firstThree.length - index }}次下单</text>
						<text>下单成功，坐等开吃</text>
					</view>
					<block v-for="(subItem, subIndex) in item.goods_list" :key="subIndex">
						<view class="foot-deta">
							<view><image :src="subItem.image[0].url" mode="aspectFill"></image></view>
							<view class="foot-name">
								<text>{{ subItem.name }}</text>
								<text>{{ subItem.quantity }}份</text>
							</view>
							<view class="foot-total">¥{{ subItem.signprice }}</view>
						</view>
					</block>
					<!-- 展示更多 -->
					<view class="expand-more" v-if="item.max > 3" @click="loadMore(index)">
						<text>展开全部</text>
						<image src="../../static/tab/zhankai.svg"></image>
					</view>
				</view>
			</block>

			<!-- 订单号 -->
			<view class="foot-back order-number">
				<text>订单编号：{{ order.order_num }}</text>
				<text>下单时间：{{ order.order_time }}</text>
				<text>桌台名称：{{ order.table_number }}</text>
			</view>
			<view style="height: 300rpx;"></view>
		</view>
		<!-- 加菜 -->
		<view class="add-a-dish" @click="addDishes" :style="{'padding-bottom':iphongCheck==true ? '50rpx':''}">
			<!-- 总计 -->
			<view class="total-view">
				<view>共 {{ totalQuan }} 份</view>
				<view class="total-price">
					<text>总计</text>
					<text>¥{{ totalPrice }}</text>
				</view>
			</view>
			<view class="add" v-if="isShow">加菜</view>
		</view>
		<detail v-if="isShowSkeleton"></detail>
	</view>
</template>

<script>
	import detail from '../skeleton/detail.vue'
export default {
	components:{detail},
	data() {
		return {
			order: null, //订单信息
			menu: [], //菜单信息
			complete: [], //menu 完整项
			firstThree: [], //menu 前三项
			totalQuan: 0, //总份
			totalPrice: 0, //总价格
			isShow: true, //加菜 bar 是否显示
			iphongCheck:getApp().globalData.iphongCheck,
			isShowSkeleton:true
		};
	},
	methods: {
		//获取订单
		async getOrder() {
			let uid = wx.getStorageSync('uid');
			let openid = wx.getStorageSync('openid');
			let table_num=wx.getStorageSync('table_num');
			let res = await new this.$Requst('/order/getorderdetail', 'POST', { openid, uid,table_num }).req();
			this.order = res.data.data[0];
			this.menu = this.order.menu;
			this.totalPrice = parseFloat(this.order.settle_amount).toFixed(2);
			//获取总份
			this.totalQuan = this.menu.length;
			this.complete = this.menu;
			//获取前三项
			this.firstThree = this.menu.map(item => {
				return {
					backup: item.backup,
					goods_list: item.goods_list.slice(0, 3),
					max: item.goods_list.length
				};
			});
			this.isShowSkeleton=false
		},
		//加载更多
		loadMore(i) {
			this.$set(this.firstThree[i], 'goods_list', this.complete[i].goods_list);
			this.$set(this.firstThree[i], 'max', 0);
		},
		//加菜
		addDishes() {
			//跳转到点菜页面
			wx.redirectTo({
				url: '../hone-page/hone-page'
			});
		}
	},
	onLoad(value) {
		let { val } = value;
		this.isShow = val == '0' ? false : true;
		this.getOrder();
	}
};
</script>

<style>
page {
	background-color: #f4f4f4;
}
.details-view {
	position: relative;
}
.order-top {
	background: linear-gradient(to bottom, #f7d45f, #f7d562, #f8d561, #f9db76, #f9de80);
	height: 300rpx;
}
.order-remind view:nth-child(1) {
	font-size: 35rpx;
	font-weight: bold;
	padding-bottom: 20rpx;
}
.order-remind {
	height: 200rpx;
	padding: 50rpx 0 0 50rpx;
}
.food-list {
	position: absolute;
	top: 200rpx;
	left: 20rpx;
	right: 20rpx;
}
.foot-back {
	background-color: #fefefe;
	border-radius: 10rpx;
	padding: 0 20rpx;
	margin-bottom: 30rpx;
	overflow-y: auto;
}
.foot-til {
	height: 100rpx;
	color: #999999;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.foot-deta image {
	display: block;
	width: 130rpx;
	height: 130rpx;
	border-radius: 10rpx;
}
.foot-deta {
	display: flex;
	justify-content: space-between;
	height: 130rpx;
	margin: 40rpx 0;
}
.foot-name {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0 20rpx;
	font-size: 30rpx;
}
.foot-name text:nth-child(1) {
	font-size: 31rpx !important;
	font-weight: bold;
}
.foot-name text:nth-child(2) {
	color: #666666;
}
.foot-total {
	font-weight: bold;
}
/* 展开更多 */
.expand-more image {
	width: 25rpx;
	height: 25rpx;
	display: block;
	padding-left: 10rpx;
}
.expand-more {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999999;
	font-size: 25rpx;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f1f1f2;
}
/* 总计 */
.total-price {
	display: flex;
	align-items: center;
	color: #333333;
	padding-left: 40rpx;
}
.total-price text:nth-child(2) {
	font-size: 35rpx;
	font-weight: bold;
	padding-left: 30rpx;
}
.total-view {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding: 30rpx 0;
}
.total-view view:nth-child(1) {
	color: #999999;
}
/* 订单号 */
.order-number text {
	display: block;
	padding: 15rpx 0;
	font-size: 28rpx;
	color: #999999;
}
/* 加菜 */
.add-a-dish {
	background-color: #fefefe;
	height: 120rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	box-shadow: 0rpx -1.9rpx 1rpx 1rpx #f9f9f9;
	padding: 0 20rpx;
	z-index: 9;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.add-a-dish .add {
	background: linear-gradient(to right, #f8da81, #f8d771, #f7d362, #f6cb4a);
	width: 200rpx;
	height: 75rpx;
	line-height: 75rpx;
	text-align: center;
	border-radius: 50rpx;
	font-weight: bold;
}
</style>
