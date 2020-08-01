/* ====================================== 自定义 webpack 配置  ====================================== */
const { override, fixBabelImports, addLessLoader, addWebpackAlias } = require('customize-cra')
const resolve = dir => require('path').join(__dirname,dir)

process.env.GENERATE_SOURCEMAP = false; // 关闭 css sourceMap 打包

module.exports = override(
	addWebpackAlias({
		['@'] 			: resolve('src'),
		['@assets'] 	: resolve('src/assets'),
		['@css'] 		: resolve('src/assets/css'),
		['@img'] 		: resolve('src/assets/images'),
		['@js'] 		: resolve('src/assets/js'),
			
	  	['@com'] 		: resolve('src/common'),
		['@utils'] 		: resolve('src/common/utils'),
			
	  	['@cpt'] 		: resolve('src/global.components/component'),
		['@tp'] 		: resolve('src/global.components/template'),
		['@plugin']		: resolve('src/global.components/plugin'),
		
		['@antd'] 		: resolve('src/global.components/plugin/antd'),
		['@mu'] 		: resolve('src/global.components/plugin/material-ui'),
		['@es'] 		: resolve('src/global.components/plugin/echarts'),
			
		['#cpt'] 		: resolve('src/private.components/component'),
		['#tp'] 		: resolve('src/private.components/template'),
		['#plugin']		: resolve('src/private.components/plugin'),
		['#page'] 		: resolve('src/private.components/page'),
			
		['@views'] 		: resolve('src/views'),
	}),
	// 异步引入 antd 配置
	fixBabelImports('import', {
		libraryName: 'antd',
		libraryDirectory: 'es',
		style: true,
	}),
	// 自定义主题
	addLessLoader({
		javascriptEnabled: true,
		modifyVars: { '@primary-color': '#1890ff' },
	})
)