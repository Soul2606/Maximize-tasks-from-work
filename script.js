

class Task {
	constructor(requirements, produce=[]) {
		/**
		 * @type {Resource[]}
		 */
		this.requirements = requirements
		/**
		 * @type {Resource[]}
		 */
		this.produce = produce
		this.planned = 0
	}

	/**
	 * @returns {number}
	 */
	max(){
		return Math.min(...this.requirements.map(r=>{
			const resource = resources[r.name]
			const base = (resource ? resource.amount : 0)

			const idx = tasks.indexOf(this)
			const net = tasks.slice(0,idx).reduce((prev, task)=>{
				const produce = task.produce.find(t=>t.equals(r))
				const consume = task.requirements.find(t=>t.equals(r))
				return prev + (produce ? produce.amount * task.getDone() : 0) - (consume ? consume.amount * task.getDone() : 0)
			}, 0)
			
			return base + net
		}))
	}

	getDone(){
		return Math.max(Math.min(this.planned, this.max()), 0)
	}

	/**
	 * @param {number} amount 
	 */
	setPlanned(amount){
		this.planned = amount
		return this
	}

	setMax(){
		this.planned = this.max()
		return this
	}
}

class Resource {
	constructor(name, amount) {
		/**
		 * @type {string}
		 */
		this.name = name
		/**
		 * @type {number}
		 */
		this.amount = amount
	}

	/**
	 * @param {number} amount 
	 */
	inst(amount){
		return new Resource(this.name, amount)
	}

	/**
	 * @param {Resource} resource 
	 * @returns {boolean}
	 */
	equals(resource){
		return resource.name === this.name
	}
}


//Initial amount
const resources = Object.fromEntries(
	[
		new Resource('a', 12),
		new Resource('b', 10),
		new Resource('c', 6),
	].map(r => [r.name, r])
);


const tasks = [
	new Task([resources.a.inst(1)]),
	new Task([resources.a.inst(1), resources.b.inst(1)], [resources.c.inst(1)]),
	new Task([resources.c.inst(1)], [resources.a.inst(1)]),
]





/**
 * @param {string} btnText 
 * @param {string[]} options 
 * @param {(i:number,e:Event,button:HTMLButtonElement)=>void} onSelect 
 * @returns {HTMLElement}
 */
function createDropdown(btnText, options, onSelect) {
	
	const root = document.createElement('div')
	root.className = 'dropdown'
	
	const dropdown = document.createElement('div')
	dropdown.className = 'dropdown-menu'
	const hide = ()=>dropdown.style.display = 'none'
	const show = ()=>dropdown.style.display = ''
	hide()
	dropdown.addEventListener('mouseleave', hide)
	options.forEach((v,i)=>{
		const b = document.createElement('button')
		b.className = 'dropdown-menu-item'
		b.textContent = v
		b.addEventListener('click',e=>{
			e.stopPropagation()
			onSelect(i,e,button)
			hide()
		})
		dropdown.append(b)
	})

	root.append(dropdown)

	const button = document.createElement('button')
	button.className = 'dropdown-button'
	button.textContent = btnText
	button.addEventListener('click',show)
	root.append(button)

	return root
}



/**
 * @param {Task} task 
 * @returns {HTMLElement}
 */
function createTask(task) {
	const root = document.createElement('div')

	const resourcesArray = Object.values(resources).map(v=>v.name)
	const addReq = createDropdown('Add requirement', resourcesArray, (i,e,btn)=>{
		console.log(i)
		btn.textContent = resourcesArray[i]
		task.requirements.push(Object.values(resources)[i])
	})
	root.append(addReq)

	const addProd = createDropdown('Add produce', resourcesArray, (i,e,btn)=>{
		console.log(i)
		btn.textContent = resourcesArray[i]
		task.produce.push(Object.values(resources)[i])
	})
	root.append(addProd)

	return root
}

document.body.append(createTask(tasks[0]))
