/* ====================================== toast  ====================================== */
import React from 'react'
import { Radio, Form } from 'antd'
const $fn = window.$fn
// ===================================================================== Radio
export default ({ data, nameStr, name, value, onChange, onClick, dicId }) => {
	let nStr = nameStr || 'codeName'
	const [ xdata, setData ] = React.useState(data||[])
	React.useEffect(()=>{
		if(dicId){
			$fn.getDic(dicId).then(data=>{
				setData(data)
			})
		}
	},[ dicId ])
	return (
		<Form.Item name={name}>
			<Radio.Group value={value} onChange={onChange?onChange:()=>{}} >
				{
					xdata.map((v, i) => <Radio.Button key={i} onClick={()=>{onClick&&onClick(i)}} value={v.id} style={{ marginRight: '20px' }}>{v[nStr]}</Radio.Button>)
				}
			</Radio.Group>
		</Form.Item>
	)
}