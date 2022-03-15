import { onAuthStateChanged } from "@firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "@firebase/firestore";
import dayjs from "dayjs";
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

  const onChangeTodoTitle = (e) => {
    e.preventDefault();
    setTodoTitle(e.target.value);
  };
  const onClickAddTodo = (e) => {
    e.preventDefault();
    addDoc(collection(dbService, "todos"), {
      title: todoTitle,
      createdAt: dayjs().format(),
    });
    setTodoTitle("");
  };
  const onClickComplete = (e, todoId, todoComplete) => {
    e.preventDefault();
    updateDoc(doc(collection(dbService, "todos"), todoId), {
      changedAt: dayjs().format(),
      complete: todoComplete === false ? true : false,
    });
  };
  const onClickWorking = (e, todoId, todoWorkArray) => {
    e.preventDefault();
    let newWorkArray = todoWorkArray ? todoWorkArray : [];

    if (
      newWorkArray.length > 0 &&
      newWorkArray[newWorkArray.length - 1]["end"] === undefined
    ) {
      newWorkArray[newWorkArray.length - 1].end = dayjs().format();
    } else {
      newWorkArray.push({ start: dayjs().format() });
    }

    updateDoc(doc(collection(dbService, "todos"), todoId), {
      changedAt: dayjs().format(),
      workArray: newWorkArray,
    });
  };

  onAuthStateChanged(authService, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(dbService, "todos"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTodoList(list);
      }
    );
    return unsub;
  }, [todoList]);

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
      <div style={{ display: "flex", flexDirection: "column" }}>
        {todoList?.map((todo, index) => (
          <div key={`${index}`} className="flex flex-row items-center">
            {todo.title}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4"
              onClick={(e) => onClickWorking(e, todo.id, todo.workArray)}
            >
              {todo["workArray"] === undefined ? "시작" : "종료"}
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4"
              onClick={(e) => onClickComplete(e, todo.id, todo.complete)}
            >
              {todo?.complete === false ? "미완료" : "완료"}
            </button>
            <div className="flex flex-col">
              {todo?.workArray?.map((work) => (
                <div>
                  {work.start} ~ {work.end}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
