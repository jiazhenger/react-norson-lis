import React from 'react'
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js' 
// ===================================================================== global declare
const { $async, $fn, $http } = window
// ===================================================================== antd
const message = import('@antd/message')
const Input = $async(()=>import('@antd/form/input')) 
// ===================================================================== component  
const Table = $async(()=>import('#cpt/table'))  
// ===================================================================== component 
export default class extends React.Component{ 
	state = { 
		data: [],  
		bone_marrow_slice: 0,
		blood: 0,
		infos: {}, // 详情
	} 
	cols = [ 
		{ title: '细胞明细', 	field: 'name', 					width: 120 },  
		{ title: '骨髓片', 		field: 'bone_marrow_slice', 	width: 120, render: ({rows}) => { 
			return (<> <Input width={110} value={rows.bone_marrow_slice} style={{borderRadius: '4px'}} onChange={(e) => this.onChanges({rowsId: rows.id, value: e, field: 'bone_marrow_slice'}) } /> { rows.id !== 22 && <span>%</span>} </>) 
		} },  
		{ title: '血片', 		field: 'blood', 				width: 120, render: ({rows}) => {
			return (<> <Input width={110} value={rows.blood} style={{borderRadius: '4px'}} onChange={(e) => this.onChanges({rowsId: rows.id, value: e, field: 'blood'}) } /> { rows.id !== 22 && <span>%</span>} </>) 
		} },  
	]
	setTableData() {
		let d = [
		  { name: "原始血细胞", bone_marrow_slice: "", blood: "", id: 0 },
		  { name: "原始粒细胞", bone_marrow_slice: "", blood: "", id: 1 },
		  { name: "早幼粒细胞", bone_marrow_slice: "", blood: "", id: 2 },
		  { name: "中性粒细胞中幼", bone_marrow_slice: "", blood: "", id: 3 },
		  { name: "中性粒细胞晚幼", bone_marrow_slice: "", blood: "", id: 4 },
		  { name: "中性粒细胞杆状核", bone_marrow_slice: "", blood: "", id: 5 },
		  { name: "中性粒细胞分叶核", bone_marrow_slice: "", blood: "", id: 6 },
		  { name: "嗜酸性粒细胞中幼", bone_marrow_slice: "", blood: "", id: 7 },
		  { name: "嗜酸性粒细胞晚幼", bone_marrow_slice: "", blood: "", id: 8 },
		  { name: "嗜酸性粒细胞杆状核", bone_marrow_slice: "", blood: "", id: 9 },
		  {
			name: "嗜酸性粒细胞分叶核",
			bone_marrow_slice: "",
			blood: "",
			id: 10
		  },
		  {
			name: "嗜碱性粒细胞中幼",
			bone_marrow_slice: "",
			blood: "",
			id: 11
		  },
		  {
			name: "嗜碱性粒细胞晚幼",
			bone_marrow_slice: "",
			blood: "",
			id: 12
		  },
		  {
			name: "嗜碱性粒细胞杆状核",
			bone_marrow_slice: "",
			blood: "",
			id: 13
		  },
		  {
			name: "嗜碱性粒细胞分叶核",
			bone_marrow_slice: "",
			blood: "",
			id: 14
		  },
		  { name: "原始红细胞", bone_marrow_slice: "", blood: "", id: 15 },
		  { name: "早幼红细胞", bone_marrow_slice: "", blood: "", id: 16 },
		  { name: "中幼红细胞", bone_marrow_slice: "", blood: "", id: 17 },
		  { name: "晚幼红细胞", bone_marrow_slice: "", blood: "", id: 18 },
		  { name: "早巨红细胞", bone_marrow_slice: "", blood: "", id: 19 },
		  { name: "中巨红细胞", bone_marrow_slice: "", blood: "", id: 20 },
		  { name: "晚巨红细胞", bone_marrow_slice: "", blood: "", id: 21 },
		  { name: "粒：幼红比值", bone_marrow_slice: "", blood: "", id: 22 },
		  { name: "原始淋巴细胞", bone_marrow_slice: "", blood: "", id: 23 },
		  { name: "幼稚淋巴细胞", bone_marrow_slice: "", blood: "", id: 24 },
		  { name: "淋巴细胞", bone_marrow_slice: "", blood: "", id: 25 },
		  { name: "异常淋巴细胞", bone_marrow_slice: "", blood: "", id: 26 },
		  { name: "原始单核细胞", bone_marrow_slice: "", blood: "", id: 27 },
		  { name: "幼稚单核细胞", bone_marrow_slice: "", blood: "", id: 28 },
		  { name: "单核细胞", bone_marrow_slice: "", blood: "", id: 29 },
		  { name: "原始浆细胞", bone_marrow_slice: "", blood: "", id: 30 },
		  { name: "幼稚浆细胞", bone_marrow_slice: "", blood: "", id: 31 },
		  { name: "浆细胞", bone_marrow_slice: "", blood: "", id: 32 },
		  { name: "原始巨核细胞", bone_marrow_slice: "", blood: "", id: 33 },
		  { name: "幼稚型巨核细胞", bone_marrow_slice: "", blood: "", id: 34 },
		  { name: "颗粒型巨核细胞", bone_marrow_slice: "", blood: "", id: 35 },
		  { name: "产板型巨核细胞", bone_marrow_slice: "", blood: "", id: 36 },
		  { name: "裸核型巨核细胞", bone_marrow_slice: "", blood: "", id: 37 },
		  { name: "网状细胞", bone_marrow_slice: "", blood: "", id: 38 },
		  { name: "内皮细胞", bone_marrow_slice: "", blood: "", id: 39 },
		  { name: "组织细胞", bone_marrow_slice: "", blood: "", id: 40 },
		  { name: "分类不明细胞", bone_marrow_slice: "", blood: "", id: 41 },
		  { name: "其他异常细胞", bone_marrow_slice: "", blood: "", id: 42 }
		];
		return d;
	}
	componentDidMount () { 
		this.props.onRef(this) 
		const {infos} = this.props  
		if ($fn.hasObject(infos)) {
			this.setState({infos: infos})
			this.setForms(infos.content)
		} else { 
			this.setForms()
		}
	}
	componentWillReceiveProps ({infos}) { 
		this.setState({infos: infos})
		this.setForms(infos.content)
	}
	setForms = (v) => {   
		if ($fn.hasObject(v)) {
			const data = $fn.hasArray(v.clinicaldiagnosis_table) ? v.clinicaldiagnosis_table : this.setTableData()
			this.setState({data: data}, () => {
				this.setNum('bone_marrow_slice')
				this.setNum('blood')
			})
		} else {
			this.setState({data: this.setTableData()}, () => {
				this.setNum('bone_marrow_slice')
				this.setNum('blood')
			})
		} 
	}
	onChanges = ({ rowsId, value, field }) => { 
		const { data } = this.state
		data.forEach(i => {
			if (rowsId === i.id) {
			  i[field] = value 
			}
		})
		this.setState({data}) 
		this.setNum(field)
	}
	setColor = (value) => {
		if (value === 100) {
			return "rgba(0, 174, 75, 1)";
		} else {
			return "rgba(255, 78, 0, 1)";
		}
	}
	setNum = (field) => {
		const { data } = this.state
		let d = 0;
		data.forEach(j => {
			if (j[field] && Number(j.id) !== 22) {
				d = this.floatAdd(d, parseFloat(j[field]))
			}
		})  
		this.setState({[field]: d})
	} 
	
    floatAdd(a, b) {
		let c, d, e;
		if (undefined == a || null == a || "" == a || isNaN(a)) {
		  a = 0;
		}
		if (undefined == b || null == b || "" == b || isNaN(b)) {
		  b = 0;
		}
		try {
		  c = a.toString().split(".")[1].length;
		} catch (f) {
		  c = 0;
		}
		try {
		  d = b.toString().split(".")[1].length;
		} catch (f) {
		  d = 0;
		}
		e = Math.pow(10, Math.max(c, d));
		return (this.floatMul(a, e) + this.floatMul(b, e)) / e;
	}
	floatMul(a, b) {
		let c = 0,
		  d = a.toString(),
		  e = b.toString();
		try {
		  c += d.split(".")[1].length;
		} catch (f) {}
		try {
		  c += e.split(".")[1].length;
		} catch (f) {}
		return (
		  (Number(d.replace(".", "")) * Number(e.replace(".", ""))) /
		  Math.pow(10, c)
		);
	} 
	submits = () => { 
		const { infos, data } = this.state
		if (!$fn.hasObject(infos)) { return message.then(f => f.default.error('请选择一条列表数据')) }
		let d = data.map(i => {
            return {
              name: i.name,
              bone_marrow_slice: i.bone_marrow_slice,
              blood: i.blood,
              id: i.id
            };
        });
		let param = {
			uuid: infos.uuid,
			content: { clinicaldiagnosis_table: d },
			dmodel: ts.getPath().id
		}; 
		$http.submit(null,'result-unit-item/update', { param: param, successText: '操作成功'})
	}
	render () {
		const { className } = this.props
		const { data, bone_marrow_slice, blood } = this.state
		return (
			<div className={`${className} xplr p10`}> 
				 <Table 
				 	className       = 'h pb30'
					cols			= { this.cols }
					data 			= { data }  
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
				<div className='fx tc' style={{position: 'absolute', bottom: 0, left: 0, height: '40px', lineHeight: '40px', width: '100%', borderTop: '1px solid #EEEEEE', padding: '0 10px'}}>
					<div className='ex'>统计</div>
					<div className='ex' style={{color: this.setColor(bone_marrow_slice)}}>{bone_marrow_slice}</div>
					<div className='ex' style={{color: this.setColor(blood)}}>{blood}</div>
				</div>
			</div>
		) 
	}  
}