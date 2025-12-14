

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
