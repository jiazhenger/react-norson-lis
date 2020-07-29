/* ====================================== 自定义 webpack 配置  ====================================== */
const { override, fixBabelImports, addLessLoader, addWebpackAlias } = require('customize-cra')
const resolve = dir => require('path').join(__dirname,dir)

process.env.GENERATE_SOURCEMAP = false; // 关闭 css sourceMap 打包

module.exports = override(
	 // 关闭 css sourceMap 打包
	addWebpackAlias({
		['@'] 		: resolve('src'),
	  	['@com'] 	: resolve('src/common'),
	  	['@cpt'] 	: resolve('src/components'),
        ['@tp'] 	: resolve('src/template'),
        ['@antd'] 	: resolve('src/components/antd'),
        ['@mu'] 	: resolve('src/components/material-ui'),
        ['@es'] 	: resolve('src/components/echarts'),
	  	['@cpx'] 	: resolve('src/components-x'),
	  	['@assets'] : resolve('src/assets'),
	  	['@css'] 	: resolve('src/assets/css'),
	  	['@img'] 	: resolve('src/assets/images'),
	  	['@js'] 	: resolve('src/assets/js'),
	  	['@pages'] 	: resolve('src/pages'),
		['@redux'] 	: resolve('src/redux')
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