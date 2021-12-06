
//形成订单编号
function orderCode(){
	let code=''
	for(let i =0;i < 6;i++){
		code += Math.floor(Math.random(0,1) * 10)
	}
	code = Date.now() + code
	return code
}
export {orderCode}