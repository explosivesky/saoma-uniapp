<script>
	export default {
		globalData:{
			iphongCheck:''
		},
		onLaunch: function() {
		  // wx.cloud.init({
		  //   env: 'cloud1-4gz86e9f69107f8f',//云开发环境
		  //   traceUser: true,
		  // })
		//兼容 ios 底部线条
		  wx.getSystemInfo({
			  success:(res)=>{
				  if(res.safeArea.top >= 40){
					  this.globalData.iphongCheck=true
				  }else{
					  this.globalData.iphongCheck=false
				  }
			  }
		  }),
		  //建立连接
		  this.$goeasy.connect({
		      id:"", //pubsub选填，im必填
		      data:{}, //必须是一个对象，pubsub选填，im必填，用于上下线提醒和查询在线用户列表时，扩展更多的属性
		      onSuccess: function () {  //连接成功
		        console.log("连接成功") //连接成功
		      },
		      onFailed: function (error) { //连接失败
		        console.log('连接失败');
		      },
		      onProgress:function(attempts) { //连接或自动重连中
		        console.log("连接或自动重连中");
		      }
		  });
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
