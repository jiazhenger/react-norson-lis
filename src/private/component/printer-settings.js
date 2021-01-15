import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== private component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
export default class extends React.Component{
	state = {
		submit: []
	}
    model = {}
    setPrinterInfo() {
        const { submit } = this.state
        let printerInfo = $fn.longSave('printer_info')
        const printer = $fn.longSave('printer')
        $http.pull(null, 'printer/tmplList').then(data => {
            if (printerInfo) {
                for (let i in data) {
                    data[i].printer_code = printerInfo[i].printer_code || ''
                    this.printerData = data
                }
            } else {
                this.printerData = data
            }
            this.printerData = data
            if (this.printerData) {
                let form = {}
                for (let i in this.printerData) {
                    const item = this.printerData[i]
                    form = {
                        label: item.remark,
                        name: item.name,
                        data: item.printer,
                        type: 'select',
                        nameStr: 'printer_name',
                        idStr: 'printer_code',
                        full: true,
                        width: '100%'
                    }
                    submit.push(form)
                }
            }
            $fn.setSubmitValues(submit, printer||{}, ()=>{this.setState({submit})})
            $fn.longSave('printer_info', this.printerData)
        })
    }
	componentDidMount(){
        this.setPrinterInfo()
	}
	render(){
        const { submit } = this.state
        const { onClose } = this.props
		return (
            <SubmitForm
                modal
                data = { submit }
                onChange = { (v, press, { name, data }) => {
                    submit.forEach(item=>{
                        if(name === item.name) {
                            item.value = v
                        }
                    })
                } }
                onSubmit = { v => {
                    for (let o in this.printerData) {
                        for (let i in v) {
                            if (i === this.printerData[o].name) {
                                this.printerData[o].printer_code = v[i]
                            }
                        }
                    }
                    $fn.longSave('printer', v)
                    $fn.longSave('printer_info', this.printerData)
                    onClose && onClose()
                }}
                onClose = { ()=>onClose && onClose() }
                init    = { form => this.form = form }
            />
		)
	}
}