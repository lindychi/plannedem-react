import React, { useState } from "react";

import dayjs from "dayjs";

import Button from "./Button";

const TodoItem = ({
    todo,
    index,
    onClickWorking,
    onClickComplete,
    onClickDelete,
}) => {
    const [drop, setDrop] = useState(false);

    const getTimeString = (time) => {
        const secTime = time / 1000;
        if (secTime / (60 * 60 * 24) > 1) {
            return parseInt(secTime / (60 * 60 * 24)) + "일";
        } else if (secTime / 3600 > 1) {
            return parseInt(secTime / (60 * 60)) + "시간";
        } else if (secTime / 60 > 1) {
            return parseInt(secTime / 60) + "분";
        } else {
            return parseInt(secTime) + "초";
        }
    };

    return (
        <>
            <div className="p-1 flex">
                <div
                    className={`w-5 h-5 rounded-full flex-none ${
                        todo.complete === true
                            ? "bg-slate-500"
                            : "border border-slate-500"
                    }`}
                ></div>
                <div className="flex-col">
                    <div onClick={() => setDrop((prev) => !prev)}>
                        {`${getTimeString(dayjs().diff(todo.createdAt))} `}
                        {todo.title}
                    </div>
                    {drop && (
                        <div>
                            <Button
                                role="menuitem"
                                tabindex="-1"
                                onClick={(e) =>
                                    onClickWorking(e, todo.id, todo.workArray)
                                }
                            >
                                {todo["workArray"] === undefined ||
                                todo["workArray"][todo["workArray"].length - 1]
                                    .end !== undefined
                                    ? "시작"
                                    : "종료"}
                            </Button>
                            <Button
                                role="menuitem"
                                tabindex="-1"
                                onClick={(e) => onClickComplete(e, todo)}
                                /* 반복되는 할일이 완료되었을 경우, 비활성화 다음 할일에서 관리하도록 한다. */
                                disabled={
                                    todo.complete === true &&
                                    todo.iterTodoId !== undefined
                                }
                            >
                                {todo?.complete === false ? "완료" : "미완료"}
                            </Button>
                            <Button
                                role="menuitem"
                                tabindex="-1"
                                onClick={(e) => onClickDelete(e, todo.id)}
                            >
                                삭제
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col">
                {todo?.workArray?.map((work, index) => (
                    <div key={`workIndex${index}`}>
                        {work.start} ~ {work.end}
                    </div>
                ))}
            </div>
        </>
    );
};

export default TodoItem;
