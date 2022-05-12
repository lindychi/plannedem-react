import React, { useEffect, useState } from "react";
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
import { dbService } from "../firebaseConfig";
import dayjs from "dayjs";
import Button from "../components/Button";
import TodoItem from "../components/TodoItem";

const TodoList = ({ user }) => {
    const [todoTitle, setTodoTitle] = useState("");

    const [todoList, setTodoList] = useState([]);
    const [iterTodoList, setIterTodoList] = useState([]);

    const onChangeTodoTitle = (e) => {
        e.preventDefault();
        setTodoTitle(e.target.value);
    };
    const onClickAddTodo = async (e) => {
        e.preventDefault();
        const todoItem = {
            title: todoTitle,
            createdAt: dayjs().format(),
            complete: false,
            user: user.uid,
        };

        /* 공백의 할일을 추가할 수 없다. */
        /* TODO: 트림 처리 후 길이를 측정해야 하지 않을까? */
        const additionalInfo = {};
        if (todoTitle.length > 0) {
            const result = await addDoc(
                collection(dbService, "todos"),
                todoItem
            );
            additionalInfo["id"] = result.id;
        }
        setTodoList((prev) => [...prev, { ...todoItem, ...additionalInfo }]);
        setTodoTitle("");
    };
    /* 업무 완료 처리를 진행하는 함수 */
    const onClickComplete = (e, todo) => {
        e.preventDefault();
        /* 반복 할일일 경우에는 추가할일을 만드는 작업을 함께 처리해주어야한다. */
        if (todo?.iterTodoId !== undefined && todo.complete === false) {
            const iterTodo = iterTodoList.find((iter) => {
                return iter.id === todo.iterTodoId;
            });
            if (iterTodo) {
                addDoc(collection(dbService, "todos"), {
                    title: iterTodo.title,
                    createdAt: dayjs()
                        .add(iterTodo.iterValue, iterTodo.iterUnit)
                        .format(),
                    complete: false,
                    user: user.uid,
                    iterTodoId: iterTodo.id,
                });
            } else {
                console.error(`'${iterTodo}'`, `'${todo.iterTodoId}'`);
                return;
            }
        }

        const updateData = {
            changedAt: dayjs().format(),
            complete:
                todo.complete === undefined || todo.complete === false
                    ? true
                    : false,
            completedAt:
                todo.complete === undefined || todo.complete === false
                    ? dayjs().format()
                    : "",
        };

        if (
            todo.workArray !== undefined &&
            "end" in todo.workArray[todo.workArray.length - 1] === false
        ) {
            todo.workArray[todo.workArray.length - 1].end = dayjs().format();
            updateData["workArray"] = todo.workArray;
        }

        updateDoc(doc(collection(dbService, "todos"), todo.id), updateData);
    };
    const onClickDelete = (e, todoId) => {
        e.preventDefault();
        deleteDoc(doc(collection(dbService, "todos"), todoId));
        setTodoList((prev) => prev.filter((value) => value.id !== todoId));
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

    const getExecuteList = () => {
        return todoList?.filter((todo) => {
            if (
                todo.workArray === undefined /* 진행도가 없거나 */ ||
                "end" in todo.workArray[todo.workArray.length - 1] ===
                    true /* 종료된 할 일인 경우 */
            ) {
                return false;
            } else {
                return true;
            }
        });
    };

    useEffect(() => {
        if (user) {
            const unsubscribeTodos = onSnapshot(
                query(
                    collection(dbService, "todos"),
                    orderBy("createdAt", "asc"),
                    where("user", "==", user.uid),
                    where("createdAt", "<=", dayjs().format())
                ),
                (snapshot) => {
                    const list = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setTodoList(list);
                }
            );
            const unsubscribeIterTodos = onSnapshot(
                query(
                    collection(dbService, "iterTodos"),
                    orderBy("createdAt", "desc"),
                    where("user", "==", user.uid)
                ),
                (snapshot) => {
                    const list = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setIterTodoList(list);
                }
            );
            return () => {
                unsubscribeTodos();
                unsubscribeIterTodos();
            };
        }
    }, [user]);

    return (
        <div>
            <input
                type="text"
                placeholder="할 일을 입력해주세요."
                onChange={onChangeTodoTitle}
                value={todoTitle}
            />
            <Button onClick={onClickAddTodo}>할 일 추가</Button>
            <div>
                <div className="font-bold">수행중인 할일</div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {getExecuteList().map((todo, index) => (
                        <TodoItem
                            key={`${index}`}
                            todo={todo}
                            index={index}
                            onClickComplete={onClickComplete}
                            onClickWorking={onClickWorking}
                            onClickDelete={onClickDelete}
                        />
                    ))}
                </div>
            </div>
            <div>
                <div className="font-bold">남은 할일</div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {todoList
                        ?.filter(
                            (todo) =>
                                (todo.complete === undefined ||
                                    todo.complete !== true) &&
                                getExecuteList()
                                    .map((value) => value.id)
                                    .includes(todo.id) === false
                        )
                        .map((todo, index) => (
                            <TodoItem
                                key={`${index}`}
                                todo={todo}
                                index={index}
                                onClickComplete={onClickComplete}
                                onClickWorking={onClickWorking}
                                onClickDelete={onClickDelete}
                            />
                        ))}
                </div>
            </div>
            <div>
                <div className="font-bold">완료한 할일</div>
                {todoList
                    ?.filter(
                        (todo) =>
                            todo.complete === true &&
                            todo.completedAt >=
                                dayjs().subtract(1, "day").format()
                    )
                    .map((todo, index) => (
                        <TodoItem
                            key={`${index}`}
                            todo={todo}
                            index={index}
                            onClickComplete={onClickComplete}
                            onClickWorking={onClickWorking}
                            onClickDelete={onClickDelete}
                        />
                    ))}
            </div>
        </div>
    );
};

export default TodoList;
