// Seleção de elementos
const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditbtn = document.querySelector("#cancel-edit-btn")
const searchInput = document.querySelector("#search-input")
const filterBtn = document.querySelector("#filter-select")
const eraseBtn = document.querySelector("#erase-button")

let oldInputValue;
// Funções

const saveTodo = (text, done = 0, save = 1) => {

    const todo = document.createElement('div')
    todo.classList.add("todo")

    const todotitle = document.createElement("h3")
    todotitle.innerText = text
    todo.appendChild(todotitle)

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)

    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("remove-todo")
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)

    // Utilizando dados da LocalStorage

    if(done) {
        todo.classList.add("done")
    }

    // nao tem nescessidade de colocar a atributo é auto atribuido quando o nome é o mesmo ou o valor ja esta setado
    if(save) {
        saveTodoLocalStorage({text, done})
    }

    todoList.appendChild(todo);

    todoInput.value = '';
    todoInput.focus()
}

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}

const updateTodo = (text) => {
    //seleciona dentro da cunção para garantir que está pegando todos das lista com a querry
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        //Pegando o titulo do todo que estou atualizando
        let todoTitle = todo.querySelector("h3")

        //Verifica se o titulo do atual e igual ao titulo que foi salvo
        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text

            updadeTodoLocalStorage(oldInputValue, text)
        }
    })
}

const getSearchTodos = (search) => {

    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        //Pegando o titulo do todo que estou atualizando,igualando em lowercase
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();
        
        todo.style.display = "flex"

        if(!todoTitle.includes(normalizedSearch)){
            todo.style.display = "none"
        }
    })
}

const filterTodos = (filterValue) => {

    const todos = document.querySelectorAll(".todo")

    switch(filterValue) {
        case "all":
            todos.forEach((todo) => todo.style.display = 'flex')
            break;

        case "done":
            todos.forEach((todo) => todo.classList.contains("done") 
            ? (todo.style.display = 'flex') 
            : (todo.style.display = 'none')
            );
            break;

        case "todo":
            todos.forEach((todo) => !todo.classList.contains("done") 
            ? (todo.style.display = 'flex') 
            : (todo.style.display = 'none')
            );
            break;

        default:
            break;
    }

}


//Eventos

todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const inputValue = todoInput.value

    if(inputValue) {
        // Save to do
         saveTodo(inputValue)
    }
})

document.addEventListener("click", (e) => {
    const targetEl = e.target
    const parentEl = targetEl.closest("div")
    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText 
    }

    if(targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle ("done")

        updadeTodoStatusLocalStorage(todoTitle);
    }

    if(targetEl.classList.contains("remove-todo")){
        parentEl.remove()

        removeTodoLocalStorage(todoTitle)
    }

    if(targetEl.classList.contains("edit-todo")){
        toggleForms()

        //Preenche previamente o input com o titulo
        editInput.value = todoTitle
        //salva o titulo para selecionar qual tarefa sera editada
        oldInputValue = todoTitle
    }    
})

cancelEditbtn.addEventListener('click', (e) => {
    e.preventDefault()

    toggleForms()
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    //pega o valor editado
    const editInputValue = editInput.value

    if(editInputValue) {
        //atualizar
        updateTodo(editInputValue)
    }

    toggleForms()

})

searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value

    getSearchTodos(search)
})

eraseBtn.addEventListener('click', (e) => {
    e.preventDefault()

    searchInput.value = ''

    //Disparando um evento de keyup para chama a funcao 
    searchInput.dispatchEvent(new Event('keyup'))
})

filterBtn.addEventListener('change', (e) => {

    const filterValue = e.target.value

    filterTodos(filterValue)

})

// Local storage

const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || []

    return todos;
};

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })
};

const saveTodoLocalStorage = (todo) => {
    // Todos os todos da ls
    const todos = getTodosLocalStorage()
    // Add o novo to do no arr
    todos.push(todo)
    // salvar tudo na ls
    localStorage.setItem("todos", JSON.stringify(todos))
};

const removeTodoLocalStorage = (todoText) => {
    
    const todos = getTodosLocalStorage();
    
    const filteredTodos = todos.filter((todo) => todo.text !== todoText)
    
    localStorage.setItem("todos", JSON.stringify(filteredTodos))
};


const updadeTodoStatusLocalStorage = (todoText) => {

    const todos = getTodosLocalStorage();
    
    // map nao retorna dados, modifica o dado original
    todos.map((todo) => todo.text == todoText ? todo.done = !todo.done : null)
    
    localStorage.setItem("todos", JSON.stringify(todos))
}

const updadeTodoLocalStorage = (todoOldText, todoNewText) => {

    const todos = getTodosLocalStorage();
    
    // map nao retorna dados, modifica o dado original
    todos.map((todo) => {
        todo.text == todoOldText ? (todo.text = todoNewText) : null
    })
    localStorage.setItem("todos", JSON.stringify(todos))
}




loadTodos();