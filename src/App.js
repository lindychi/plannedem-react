import { onAuthStateChanged } from "@firebase/auth";
import { useState } from "react";
import { authService } from "./firebaseConfig";

import Login from "./pages/Login";
import TodoList from "./pages/TodoList";
import Drawer from "./components/Drawer";

function App() {
    const [user, setUser] = useState(authService.currentUser);
    const [open, setOpen] = useState(false);

    onAuthStateChanged(authService, (user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    });

    return user === null ? (
        <Login />
    ) : (
        <div>
            <div class="flex items-center">
                <svg
                    class="w-6 h-6 m-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                </svg>
                할 일 목록
            </div>
            <TodoList user={user} />
            <Drawer isOpen={open} setIsOpen={setOpen}>
                <div className="flex">
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        ></path>
                    </svg>
                    할 일 목록
                </div>
            </Drawer>
        </div>
    );
}

export default App;
