/* ====================================== toast  ====================================== */
import { message } from 'antd'
// ===================================================================== Select
message.config({ top: '40%', duration:0.5 })
export default {
	success(msg){
		message.success(msg)
	},
	error(msg){
		message.error(msg)
	},
	info(msg){
		message.info(msg)
	},
	warning(msg){
		message.warning(msg)
	},
	warn(msg){
		message.warn(msg)
	},
	loading(msg){
		message.loading(msg)
	},
}