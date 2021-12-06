
class Requst{
	constructor(url,method,data,header){
		this.url = url
		this.method=method||'GET'
		this.data=data||{}
		this.header=header||{}
	}
	req(){
		//---/uniapp/submitDishes
		let url='https://www.explosivesky.vip:443/api'+this.url
		// let url='http://localhost:3008/api'+this.url
		return new Promise((resolve,reject)=>{
		try{
			uni.request({
				url,
				data:this.data,
				header:this.header,
				method:this.method,
				timeout:60000,
				success:(res)=>{
					resolve(res)
				}
			})
		}catch(e){
			reject(e)
		}
		})
	}
}

// function concatUrl(value){
// 	let url='http://localhost:3008'+value
// 	return url
// }
module.exports = Requst