/* ====================================== 异步加载路由  ====================================== */
import React, { Component } from 'react'
// ===================================================================== loadding 
import PageLoading from '@base/page-loading'
// =====================================================================
export const Bundle = importComponent => {
    return class extends Component {
       	
       	state = {
       		Component: () => <PageLoading/>
       	}

        async componentDidMount() {
            const { default: component } = await importComponent()
        	
        	this.setState({ Component: component })
        }
        
        render() {
            const { Component } = this.state

            return Component ? <Component {...this.props} /> : null
        }
    }
}

export default path => Bundle(() => import('@pages/' + path))
