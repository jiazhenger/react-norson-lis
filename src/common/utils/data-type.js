/* ====================================== 数据类型  ====================================== */
const $ = {
	hasArray 	: d => $.isArray(d) && d.length > 0,
	hasObject 	: d => $.isObject(d) && Object.keys(d).length > 0,
	isEmpty 	: d => d === null || d === undefined || d === '',
	isValid 	: d => !$.isEmpty(d) || d === 0 || d === false
};

(['String', 'Number', 'Array', 'Object', 'Boolean', 'Function', 'Undefined']).forEach(v =>  $['is' + v] = obj => ( {}.toString.call(obj) === '[object '+ v +']' ) )

export default $