import React from 'react'
// ===================================================================== material-ui
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
// ===================================================================== private
const ListStyle = makeStyles({
	root: {
		padding:0
	}
})
const ListItemIconStyle = makeStyles({
	root: {
		minWidth:0,
		marginRight:'10px'
	}
})
// =====================================================================
export default props => {
	const { label, icon, img, dividerNo, dividerFull, onClick, push, replace } = props
	
	let click = onClick
	if(replace) click = ()=> props.history.replace(replace)
	else if(push) click = ()=> props.history.push(push)
	
	return (
		<>
			<List classes ={ListStyle()} onClick={click}>
				<ListItem button>
					{
						icon && <ListItemIcon classes ={ListItemIconStyle()}>{icon}</ListItemIcon>
					}
					{
						img && <ListItemIcon classes ={ListItemIconStyle()}><div><img src={img} style={{width:'18px'}} alt='' /></div></ListItemIcon>
					}
					<ListItemText primary={label} />
				</ListItem>
			</List>
			{
				!dividerNo && <div className={`${dividerFull ? '' : 'xplr'}`}><Divider /></div>
			}
		</>
	)
}
