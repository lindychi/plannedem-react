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

const TodoList = ({ user }) => {
    const [todoTitle, setTodoTitle] = useState("");

    const [todoList, setTodoList] = useState([]);
    const [iterTodoList, setIterTodoList] = useState([]);

    const onChangeTodoTitle = (e) => {
        e.preventDefault();
        setTodoTitle(e.target.value);
    };
    const onClickAddTodo = (e) => {
        e.preventDefault();
        const todoItem = {
            title: todoTitle,
            createdAt: dayjs().format(),
            complete: false,
            user: user.uid,
        };
        if (todoTitle.length > 0) {
            addDoc(collection(dbService, "todos"), todoItem);
        }
        setTodoTitle("");
        setTodoList((prev) => [todoItem, ...prev]);
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
        updateDoc(doc(collection(dbService, "todos"), todo.id), {
            changedAt: dayjs().format(),
            complete: todo.complete === false ? true : false,
            completedAt: todo.complete === false ? dayjs().format() : undefined,
        });
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

    useEffect(() => {
        if (user) {
            const unsub = onSnapshot(
                query(
                    collection(dbService, "todos"),
                    orderBy("createdAt", "desc"),
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
            return unsub;
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const unsub = onSnapshot(
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
            return unsub;
        }
    }, [iterTodoList, user]);

    return (
        <div>
            <input
                type="text"
                placeholder="할 일을 입력해주세요."
                onChange={onChangeTodoTitle}
                value={todoTitle}
            />
            <Button onClick={onClickAddTodo}>할 일 추가</Button>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {todoList
                    ?.filter(
                        (todo) =>
                            todo.complete === false ||
                            (todo.completedAt !== undefined &&
                                todo.completedAt >=
                                    dayjs().subtract(1, "day").format())
                    )
                    .map((todo, index) => (
                        <>
                            <div
                                key={`${index}`}
                                className="flex flex-row items-center"
                            >
                                {todo.title}
                                <Button
                                    onClick={(e) =>
                                        onClickWorking(
                                            e,
                                            todo.id,
                                            todo.workArray
                                        )
                                    }
                                >
                                    {todo["workArray"] === undefined ||
                                    todo["workArray"][
                                        todo["workArray"].length - 1
                                    ].end !== undefined
                                        ? "시작"
                                        : "종료"}
                                </Button>
                                <Button
                                    onClick={(e) => onClickComplete(e, todo)}
                                    /* 반복되는 할일이 완료되었을 경우, 비활성화 다음 할일에서 관리하도록 한다. */
                                    disabled={
                                        todo.complete === true &&
                                        todo.iterTodoId !== undefined
                                    }
                                >
                                    {todo?.complete === false
                                        ? "완료"
                                        : "미완료"}
                                </Button>
                                <Button
                                    onClick={(e) => onClickDelete(e, todo.id)}
                                >
                                    삭제
                                </Button>
                            </div>
                            <div className="flex flex-col">
                                {todo?.workArray?.map((work, index) => (
                                    <div key={`workIndex${index}`}>
                                        {work.start} ~ {work.end}
                                    </div>
                                ))}
                            </div>
                        </>
                    ))}
            </div>
        </div>
    );
};

export default TodoList;
