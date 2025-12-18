

class Task {
	constructor(requirements=[], produce=[]) {
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


/**
 * @type {Task[]}
 */
const tasks = [
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
 * Creates elements that let the user modify a resource in an array of resources
 * @param {Object<Resource>} resources 
 * @param {Resource[]} resourcesArray 
 * @param {Resource} resource 
 * @returns {HTMLElement}
 */
function createResourceDropdown(resources, resourcesArray, resource) {
	let r = resource
	const find = ()=>{
		const idx = resourcesArray.indexOf(r)
		if (idx === -1) {
			throw new Error("Cannot find resource in resourcesArray");
		}
		return idx
	}
	find()
	const root = document.createElement('div')
	
	const removeButton = document.createElement('button')
	removeButton.textContent = 'Remove'
	removeButton.addEventListener('click', ()=>{
		try {
			resourcesArray.splice(find(), 1)
		} catch (error) {
			
		}
		root.remove()
	})
	root.append(removeButton)
	
	const resourceNames = Object.values(resources).map(v=>v.name)
	const dropdown = createDropdown(resource.name, resourceNames, (i,e,btn)=>{
		e.stopPropagation()
		btn.textContent = resourceNames[i]
		const newR = Object.values(resources)[i].inst(1)
		try {
			resourcesArray[find()] = newR
		} catch (error) {
			root.remove()
			return
		}
		r = newR
	})
	root.append(dropdown)

	return root
}



/**
 * @param {Task} task 
 * @returns {HTMLElement}
 */
function createTask(task) {
	const root = document.createElement('div')
	root.className = 'task'

	const p = document.createElement('p')
	p.contentEditable = 'true'
	p.textContent = 'Task'
	p.style.gridArea = '1/1/2/3'
	root.append(p)

	const resourceNames = Object.values(resources).map(v=>v.name)
	const addReq = createDropdown('Add requirement', resourceNames, (i,e,btn)=>{
		const resource = Object.values(resources)[i]
		task.requirements.push(resource)
		const resourceDropdown = createResourceDropdown(resources, task.requirements, resource)
		resourceDropdown.style.gridColumn = '1/2'
		root.append(resourceDropdown)
	})
	addReq.style.gridArea = '2/1/3/2'
	root.append(addReq)

	const addProd = createDropdown('Add produce', resourceNames, (i,e,btn)=>{
		console.log(i)
		btn.textContent = resourceNames[i]
		task.produce.push(Object.values(resources)[i])
	})
	addProd.style.gridArea = '2/2/3/3'
	root.append(addProd)

	return root
}

document.getElementById('add-task').addEventListener('click', () => {
	const task = new Task()
	tasks.push(task)
	document.getElementById('grid').append(createTask(task))
	console.log(tasks)

})
