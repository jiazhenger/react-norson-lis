/* ====================================== 异步加载路由  ====================================== */
import React, { Component } from 'react'
// =====================================================================
export default importComponent => {
	return class extends Component {
		state = {
			component: null
		}
		
		componentDidMount() {
			importComponent().then(f => {
                this.setState({ component: f.default} )
            })
		}
		
		render() {
			const Component = this.state.component
			return Component ? <Component {...this.props}/> : null
		}
	}
}
// const Content = Async(()=>import('@cpx/content'))