<template>
	<view>
		<view class="welcome">
			<text>欢迎来到</text>
			<text>小袁烧烤店</text>
		</view>
		<!-- 方块 -->
		<view class="people-view">
			<view class="hello">您好，请选择就餐人数</view>
			<view class="table-num">桌号：{{ table_num }}</view>
			<!-- 滑动 -->
			<view class="table-num table-scroll">
				<scroll-view scroll-x="true" class="scroll-view_H" :enable-flex="true">
					<view class="table-block">
						<block v-for="(item, index) in tables" :key="index">
							<view @click="select(item)" :class="{ 'start-activ': item === currentIndex }">{{ item + '人' }}</view>
						</block>
					</view>
				</scroll-view>
			</view>
			<!-- 按钮 -->
			<view class="start-diancan" :class="{ 'start-activ': currentIndex != '' }" @click="start">开始点餐</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			uid: '',
			currentIndex: '',
			table_num: '',
			result: 0,
			openid: ''
		};
	},
	methods: {
		select(item) {
			wx.setStorageSync('diners', item);
			this.currentIndex = item;
		},
		start() {
			if (this.currentIndex == '') return;
			if (this.result == 0) {
				wx.redirectTo({
					url: '../hone-page/hone-page'
				});
			}
		},
		link() {
			if (this.result != 0) {
				wx.redirectTo({
					url: '../order-detail/order-detail'
				});
			}
		}
	},
	//获取小程序码 参数信息 e
	async onLoad(e) {
		console.log(e);
		//小程序码进来的
		if (e.number && e.uid) {
			this.uid = e.uid;
			this.table_num = e.number;
			wx.setStorageSync('uid', this.uid);
			wx.setStorageSync('table_num', this.table_num);
		} else {
			//二维码进来的
			this.uid = wx.getStorageSync('uid');
			this.table_num = wx.getStorageSync('table_num');
		}
		//发送请求 后端获取 openid(用于发送订阅消息)
		wx.login({
			success: async res => {
				if (res.code) {
					//发起网络请求
					let open = await new this.$Requst('/uniapp/getOpen', 'POST', { code: res.code }).req();
					let openId = open.data.data;
					if ((openId != null) & (openId != undefined)) {
						wx.setStorageSync('openid', openId); //储存openid
						//点餐 || 加餐
						let res = await new this.$Requst('/uniapp/checkIn', 'POST', { uid: this.uid, table_num: this.table_num }).req();
						this.result = res.data.data[0].total;
						this.link();
					} else {
						console.info('获取用户openid失败');
					}
				} else {
					console.log('登录失败！' + res.errMsg);
				}
			}
		});
	},
	//假如 两个人，一个人已经给出了 openid，然后另一个人又扫了这个桌号，程序又获取了这个人的openid ，然后获取订单页面就没数据
	//解决方案：另一个人扫码时，判断桌号没结账，就 返回 ‘请在第一次点餐的手机中操作’
	created() {}
};
</script>

<style>
page {
	background-image: url('https://saoma-diancan-1308213628.cos.ap-beijing.myqcloud.com/diancan-index/beijing-a.jpg');
	background-attachment: fixed;
	background-repeat: no-repeat;
	background-size: cover;
}
.welcome {
	color: #ffffff;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 270rpx;
}
.welcome text {
	display: block;
	font-size: 50rpx;
}
.welcome text:nth-child(1) {
	font-family: monospace;
	padding-bottom: 20rpx;
}
/* 方块 */
.people-view {
	background-color: #ffffff;
	position: fixed;
	left: 30rpx;
	right: 30rpx;
	bottom: 100rpx;
	height: 550rpx;
	border-radius: 15rpx;
}
.hello {
	height: 80rpx;
	font-size: 35rpx;
	font-weight: bold;
	line-height: 80rpx;
	padding-left: 20rpx;
}
.table-num {
	font-size: 30rpx;
	padding-left: 20rpx;
}
.table-scroll {
	margin-top: 100rpx;
}
.scroll-view_H {
	white-space: nowrap;
	width: 100%;
	height: 75rpx;
}
.table-block {
	display: flex;
	align-items: center;
}
.table-block view {
	height: 75rpx;
	line-height: 75rpx;
	text-align: center;
	background-color: #f7f8f9;
	margin-right: 25rpx;
	padding: 0 70rpx;
	border-radius: 15rpx;
}
/* 按钮 */
.start-diancan {
	height: 90rpx;
	line-height: 90rpx;
	background-color: #fdf4d7;
	color: #c2c2c2;
	text-align: center;
	margin: 130rpx 20rpx 0 20rpx;
	border-radius: 15rpx;
}
/* 点击后加上颜色*/
.activetext {
	background-color: #f9dd89 !important;
}
.start-activ {
	color: #000000 !important;
	background: linear-gradient(to right, #f8da81, #f8d771, #f7d362, #f6cb4a) !important;
}
</style>
