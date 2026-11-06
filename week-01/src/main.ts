import './style.css'

interface User {
  id: number
  name: string
  email: string
  company: { name: string }
  address: { city: string }
}

interface Todo {
  id: number
  userId: number
  completed: boolean
}

interface Employee {
  id: number
  name: string
  email: string
  company: string
  city: string
  taskCount: number
  completedCount: number
}

const app = document.querySelector<HTMLDivElement>('#app')!

function render(users: User[], todos: Todo[]) {
  const employees: Employee[] = users.map((u) => {
    const userTodos = todos.filter((t) => t.userId === u.id)
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      company: u.company.name,
      city: u.address.city,
      taskCount: userTodos.length,
      completedCount: userTodos.filter((t) => t.completed).length,
    }
  })

  const totalEmployees = employees.length
  const companies = new Set(employees.map((e) => e.company)).size
  const totalTasks = todos.length
  const completedTasks = todos.filter((t) => t.completed).length
  const completionRate = Math.round((completedTasks / totalTasks) * 100)

  const stats = [
    { label: 'Employees', value: totalEmployees.toString() },
    { label: 'Companies', value: companies.toString() },
    { label: 'Tasks', value: totalTasks.toString() },
    { label: 'Completed', value: `${completionRate}%` },
  ]

  app.innerHTML = `
    <div class="dashboard">
      <header class="header">
        <h1>Employee Dashboard</h1>
      </header>

      <section class="stats">
        ${stats
          .map(
            (s) => `
          <div class="card">
            <div class="card__value">${s.value}</div>
            <div class="card__label">${s.label}</div>
          </div>
        `
          )
          .join('')}
      </section>

      <section class="panel">
        <h2>Employees</h2>
        <table class="table">
          <thead>
            <tr class="row row--head">
              <th class="cell cell--name" scope="col">Name</th>
              <th class="cell" scope="col">Company</th>
              <th class="cell" scope="col">City</th>
              <th class="cell" scope="col">Tasks</th>
            </tr>
          </thead>
          <tbody>
            ${employees
              .map(
                (e) => `
              <tr class="row">
                <td class="cell cell--name" data-label="Name">${e.name} <span class="symbol">${e.email}</span></td>
                <td class="cell" data-label="Company">${e.company}</td>
                <td class="cell" data-label="City">${e.city}</td>
                <td class="cell" data-label="Tasks">${e.completedCount}/${e.taskCount}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </section>
    </div>
  `
}

function renderError(message: string) {
  app.innerHTML = `<div class="dashboard"><p class="error">${message}</p></div>`
}

app.innerHTML = `
  <div class="dashboard">
    <header class="header">
      <h1>Employee Dashboard</h1>
    </header>
    <p class="loading" role="status">Loading...</p>
  </div>
`

Promise.all([
  fetch('https://jsonplaceholder.typicode.com/users').then((r) => r.json()),
  fetch('https://jsonplaceholder.typicode.com/todos').then((r) => r.json()),
])
  .then(([users, todos]: [User[], Todo[]]) => render(users, todos))
  .catch(() => {
    renderError('Failed to load dashboard data. Please try again later.')
  })

  console.log('Dashboard data loaded successfully.')