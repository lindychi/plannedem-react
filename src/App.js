import { onAuthStateChanged } from "@firebase/auth";
import { addDoc, collection, getDocs } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { authService, dbService } from "./firebaseConfig";
import Login from "./pages/Login";

import routes from "./routes";

function App() {
  let element = useRoutes(routes);
  const [user, setUser] = useState(null);
  const [todoTitle, setTodoTitle] = useState("");

  const [todoList, setTodoList] = useState([]);

  const getDataFromDb = async () => {
    const todosSnapshot = await getDocs(collection(dbService, "todos"));
    if (todosSnapshot.docs) {
      setTodoList(todosSnapshot.docs.map((doc) => ({ ...doc.data() })));
    }
  };

  const onChangeTodoTitle = (e) => {
    e.preventDefault();
    setTodoTitle(e.target.value);
  };
  const onClickAddTodo = async (e) => {
    e.preventDefault();
    addDoc(collection(dbService, "todos"), {
      title: todoTitle,
    });
    setTodoTitle("");
  };

  onAuthStateChanged(authService, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  getDataFromDb();

  return user === null ? (
    <Login />
  ) : (
    <div>
      <div>{user.email}님</div>
      <div>{element}</div>
      <input
        type="text"
        placeholder="할 일을 입력해주세요."
        onChange={onChangeTodoTitle}
        value={todoTitle}
      />
      <button onClick={onClickAddTodo}>할 일 추가</button>
      <ul>
        {todoList?.map((todo) => (
          <li>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
