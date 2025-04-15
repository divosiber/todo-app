import { use, useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";
function App() {
  const [newTodo, setNewTodo] = useState("");

  const [todos, setTodos] = useState([]);

  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log("error menambahkah", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
      console.log("Todos dari server", response.data);
    } catch (error) {
      console.log("Gagal mengambil todos", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) =>{
    try{
      const response = await axios.patch(`/api/todos/${id}`,{
        text:editedText,
      })
      setTodos(todos.map((todo)=>(todo._id === id ? response.data : todo)))
      setEditingTodo(null)
    }catch (error){
      console.log("error updateing",error)
    }
  }

  const deleteTodo = async (id) =>{
    try {
      await axios.delete(`/api/todos/${id}`)
      setTodos(todos.filter((todo)=> todo._id !== id))
    }catch (error){
      console.log("error deleting", error)
    }
  }

  const toggleTodo= async (id) =>{
    try{
      const todo = todos.find((t)=> t._id ===id)
      const response = await axios.patch(`/api/todos/${id}`,{
        completed : !todo.completed
      })
      setTodos(todos.map((t)=> t._id ===id ? response.data : t))
    } catch (error){
      console.log("error togle", error)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from gray-50 to-gray-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
          <div className="">
            <h1 className="text-center mb-7 font-bold text-[25px] text-gray-500">
              Task Manager
            </h1>
          </div>
          <form onSubmit={addTodo} className="flex items-center gap-2 mb-6">
            <input
              className="flex-1 outline-none"
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              required
            />

            <button
              type="submit"
              className="cursor-pointer bg-amber-500 p-2 rounded-md hover:bg-amber-300"
            >
              Add Task
            </button>
          </form>
          <div>
            {todos.length === 0 ? (
              <div></div>
            ) : (
              <div>
                {todos.map((todo) => (
                  <div key={todo._id}>
                    {editingTodo === todo._id ? (
                      <div className="flex items-center gap-x-3">
                        <input
                          className="p-3 flex-1 rounded-lg outline-none shadow-inner"
                          type="text"
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                        />
                        <div onClick={() => saveEdit(todo._id)} className="flex gap-x-2">
                          <button className="px-4 py-2 bg-green-400 rounded-lg cursor-pointer">
                            <MdOutlineDone />
                          </button>
                          <button
                            className="px-4 py-2 bg-gray-400 rounded-lg cursor-pointer"
                            onClick={() => setEditingTodo(null)}
                          >
                            <IoClose />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-4 overflow-hidden">
                         <button onClick={()=> toggleTodo(todo._id)} className={` flex-shrink-0 h-6 border w-6 rounded-full flex items-center justify-center ${todo.completed ? "bg-green-500 border-green-500":"border-gray-500 hover:border-blue-300"}`}>
                          {todo.completed && <MdOutlineDone />}
                          </button>
                         <span className="truncate">{todo.text}</span>
                         </div>
                          <div className="flex gap-x-3">
                            <button onClick={() => startEditing(todo)}>
                              <FaPen />
                            </button>
                            <button onClick={()=> deleteTodo(todo._id)}>
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
