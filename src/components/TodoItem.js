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
        if (time === undefined) {
            return "";
        }

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
                    onClick={(e) => onClickComplete(e, todo)}
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
                                onClick={(e) => onClickDelete(e, todo.id)}
                            >
                                삭제
                            </Button>
                        </div>
                    )}
                </div>
                <div className="pl-1 font-bold">
                    {getTimeString(
                        todo?.workArray?.reduce((prev, current) => {
                            if ("end" in current) {
                                return (
                                    prev +
                                    +dayjs(current.end).diff(current.start)
                                );
                            } else if ("start" in current) {
                                /* 현재 진행중일 경우에 시작시간부터 현재 시간까지를 합함 */
                                return prev + +dayjs().diff(current.start);
                            } else {
                                return prev;
                            }
                        }, 0)
                    )}
                </div>
            </div>
        </>
    );
};

export default TodoItem;
