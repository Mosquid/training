let startTs

function renderStatsHTML(container) {
	let stats = container.querySelector('.stats')

	if (!stats) {
		stats = document.createElement('div')
		stats.className = 'stats'
		container.prepend(stats)
	}

	stats.textContent = `Left: ${calcExecLeft()}`

	renderClockHTML(stats)
}

function calcExecLeft() {
	return Object.values(data).reduce((acc, c) => acc + c.max-(c.current || 0), 0)
}

function action(type) {
	if (!data.hasOwnProperty(type)) return
	
	data[type].current = data[type].current || 0 
	data[type].current = Math.min(data[type].current+1, data[type].max)
	
	render()
}

function actionButton(type) {
	const el = document.createElement('button')

	el.textContent = type
	el.addEventListener('click', action.bind(el, type))

	return el
}

function renderClockHTML(container) {
	if (!container) return

	let timer = container.querySelector('.clock')

	if (!timer) {
		timer = document.createElement('div')
		timer.className = 'clock'
		container.appendChild(timer)
	}

	startTs = startTs || new Date().getTime()

	const nowTs = new Date().getTime()
	const diff = nowTs - startTs
	
	const sec = Math.floor(diff / 1000)
	const mins = Math.floor(sec / 60)
	const padSec = String(sec - 60*mins).padStart(2, '0')

	timer.textContent = `Time: ${mins}:${padSec}`

	requestAnimationFrame(container => renderClockHTML(container))
}

function dataRow(type, max) {
	const row = document.createElement('div')
	
	row.className = 'data-row'
	
	while (row.children.length < max+1) {
		const cell = document.createElement('div')
		
		cell.className = 'data-cell'

		if (data[type].max < max && row.children.length > data[type].max)
			cell.classList.add('blank')
		
		if (row.children.length && row.children.length <= data[type].current)
			cell.classList.add('v')
		
		row.appendChild(cell)
	}

	row.children[0].appendChild(actionButton(type))

	return row
}

function render() {
	const container = document.querySelector('#app')
	let table = document.querySelector('.table')
	
	if (!startTs) {
		table = document.createElement('div')
		table.className = 'table'
		container.appendChild(table)
	}

	const max = Object.values(data).reduce((acc, cur) => Math.max(acc, cur.max), 0)

	table.innerHTML = ''
	
	Object.keys(data).map(type => {
		const row = dataRow(type, max)
		table.appendChild(row)
	})
	
	renderStatsHTML(container) 
}