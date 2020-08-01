/* ====================================== 数据类型  ====================================== */
const _ = {
	hasArray 	: d => _.isArray(d) && d.length > 0,
	hasObject 	: d => _.isObject(d) && Object.keys(d).length > 0,
	isEmpty 	: d => _ === null || d === undefined || d === '',
	isValid 	: d => !_.isEmpty(d) || d === 0 || d === false
};

(['String', 'Number', 'Array', 'Object', 'Boolean', 'Function', 'Undefined']).forEach(v =>  _['is' + v] = obj => ( {}.toString.call(obj) === '[object '+ v +']' ) )

export default _