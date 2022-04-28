import { onAuthStateChanged } from "@firebase/auth";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "@firebase/firestore";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { authService, dbService } from "./firebaseConfig";
import Login from "./pages/Login";

import routes from "./routes";

function App() {
    let element = useRoutes(routes);
    const [user, setUser] = useState(authService.currentUser);
    const [todoTitle, setTodoTitle] = useState("");

    const [todoList, setTodoList] = useState([]);

    const onChangeTodoTitle = (e) => {
        e.preventDefault();
        setTodoTitle(e.target.value);
    };
    const onClickAddTodo = (e) => {
        e.preventDefault();
        if (todoTitle.length > 0) {
            addDoc(collection(dbService, "todos"), {
                title: todoTitle,
                createdAt: dayjs().format(),
                complete: false,
                user: user.uid,
            });
        }
        setTodoTitle("");
    };
    /* 업무 완료 처리를 진행하는 함수 */
    const onClickComplete = (e, todo) => {
        e.preventDefault();
        updateDoc(doc(collection(dbService, "todos"), todo.id), {
            changedAt: dayjs().format(),
            complete: todo.complete === false ? true : false,
        });
    };
    const onClickDelete = (e, todoId) => {
        e.preventDefault();
        deleteDoc(doc(collection(dbService, "todos"), todoId));
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
        if (user) {
            const unsub = onSnapshot(
                query(
                    collection(dbService, "todos"),
                    orderBy("createdAt", "desc"),
                    where("user", "==", user.uid)
                ),
                (snapshot) => {
                    const list = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setTodoList(list);
                }
            );
            return unsub;
        }
    }, [todoList, user]);


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
                    <div
                        key={`${index}`}
                        className="flex flex-row items-center"
                    >
                        {todo.title}
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4"
                            onClick={(e) =>
                                onClickWorking(e, todo.id, todo.workArray)
                            }
                        >
                            {todo["workArray"] === undefined ? "시작" : "종료"}
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4"
                            onClick={(e) => onClickComplete(e, todo)}
                        >
                            {todo?.complete === false ? "완료" : "미완료"}
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4"
                            onClick={(e) => onClickDelete(e, todo.id)}
                        >
                            삭제
                        </button>
                        <div className="flex flex-col">
                            {todo?.workArray?.map((work, index) => (
                                <div key={`workIndex${index}`}>
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
