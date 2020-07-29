/* ====================================== 自定义 webpack 配置  ====================================== */
const { override, fixBabelImports, addLessLoader, addWebpackAlias } = require('customize-cra')
const resolve = dir => require('path').join(__dirname,dir)

process.env.GENERATE_SOURCEMAP = false; // 关闭 css sourceMap 打包

module.exports = override(
	addWebpackAlias({
		['@'] 		: resolve('src'),
		['@assets'] : resolve('src/assets'),
		['@css'] 	: resolve('src/assets/css'),
		['@img'] 	: resolve('src/assets/images'),
		['@js'] 	: resolve('src/assets/js'),
		
	  	['@com'] 	: resolve('src/common'),
		
	  	['@base'] 	: resolve('src/cpt-base'),
		['@template'] 	: resolve('src/cpt-template'),
		
		['@plugin'] 	: resolve('src/cpt-plugin'),
	    ['@antd'] 	: resolve('src/cpt-plugin/antd'),
	    ['@mu'] 	: resolve('src/cpt-plugin/material-ui'),
	    ['@es'] 	: resolve('src/cpt-plugin/echarts'),
		
		['@pages'] 	: resolve('src/pages'),
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