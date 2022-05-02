import { onAuthStateChanged } from "@firebase/auth";
import { useState } from "react";
import { useRoutes } from "react-router-dom";
import { authService } from "./firebaseConfig";

import routes from "./routes";

import Login from "./pages/Login";
import TodoList from "./pages/TodoList";

function App() {
    const [user, setUser] = useState(authService.currentUser);

    onAuthStateChanged(authService, (user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    });

    return user === null ? <Login /> : <TodoList user={user} />;
}

export default App;
