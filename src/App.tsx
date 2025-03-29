import './App.css';
import { useState, useEffect } from 'react';

function App() {
  interface Todo {
    description: string;
  }

  interface CompletedTodo {
    description: string;
    completedAt: string;
  }

  const [TodosDescription, setTodosDescription] = useState('');
  const [todolist, setTodolist] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<CompletedTodo[]>([]);

  
  const readFromLocalStorage = (key: string, defaultValue: any) => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          return parsedData; 
        } else {
          console.warn(`El valor de ${key} en localStorage no es un array válido.`);
        }
      }
    } catch (error) {
      console.error(`Error al leer ${key} desde localStorage:`, error);
    }
    return defaultValue; 
  };

  useEffect(() => {
    setTodolist(readFromLocalStorage('todolist', []));
    setCompletedTodos(readFromLocalStorage('completedTodos', []));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('todolist', JSON.stringify(todolist));
    } catch (error) {
      console.error('Error al guardar todolist en localStorage:', error);
    }
  }, [todolist]);


  useEffect(() => {
    try {
      localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
    } catch (error) {
      console.error('Error al guardar completedTodos en localStorage:', error);
    }
  }, [completedTodos]);

  const handleChange = (e: any) => {
    setTodosDescription(e.target.value);
  };

  const handleClick = () => {
    if (TodosDescription.trim() === '') {
      alert('¡La descripción del todo no puede estar vacía!');
      return;
    }

    if (todolist.some((todo) => todo.description === TodosDescription.trim())) {
      alert('¡Esta tarea ya existe en la lista!');
      return;
    }

    const newTodo = {
      description: TodosDescription.trim(),
    };

    setTodolist((prevTodolist) => [newTodo, ...prevTodolist]);
    setTodosDescription(''); 
  };

  const handleDelete = (index: number) => {
    setTodolist((prevTodolist) => prevTodolist.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    const todoToEdit = todolist[index];
    setTodosDescription(todoToEdit.description); 
    handleDelete(index); 
    };

  const handleComplete = (index: number) => {
    const completedTodo = todolist[index];
    const completedAt = new Date().toLocaleString(); 

    setTodolist((prevTodolist) => prevTodolist.filter((_, i) => i !== index));
    setCompletedTodos((prevCompletedTodos) => [
      ...prevCompletedTodos,
      { ...completedTodo, completedAt },
    ]);
  };

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todas las tareas?')) {
      setTodolist([]);
      setCompletedTodos([]);
      localStorage.clear();
    }
  };

  return (
    <>
      <div style={{ border: '1px solid red', padding: '10px' }}>
        <h1>Gestor de Tareas</h1>
        <div>
          <input
            type="text"
            value={TodosDescription}
            onChange={handleChange}
            placeholder="Escribe una nueva tarea"
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleClick}>Agregar</button>
          <button onClick={handleClearAll} style={{ marginLeft: '10px', color: 'red' }}>
            Limpiar Todo
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Tareas Pendientes</h3>
          {todolist.length > 0 ? (
            <ul>
              {todolist.map((todo, index) => (
                <li key={index}>
                  {todo.description}
                  <button onClick={() => handleDelete(index)} style={{ marginLeft: '10px' }}>
                    Eliminar
                  </button>
                  <button onClick={() => handleEdit(index)} style={{ marginLeft: '10px' }}>
                    Editar
                  </button>
                  <button onClick={() => handleComplete(index)} style={{ marginLeft: '10px' }}>
                    Completar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay tareas pendientes.</p>
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Tareas Completadas</h3>
          {completedTodos.length > 0 ? (
            <select style={{ width: '100%' }} defaultValue="">
              <option value="" disabled>
                Selecciona una tarea completada
              </option>
              {completedTodos.map((todo, index) => (
                <option key={index}>
                  {todo.description} (Completado el: {todo.completedAt})
                </option>
              ))}
            </select>
          ) : (
            <p>No hay tareas completadas aún.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;