import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { useState } from "react";
import { authService } from "../firebaseConfig";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(true);

  function onChange(e) {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (login) {
        signInWithEmailAndPassword(authService, email, password);
      } else {
        createUserWithEmailAndPassword(authService, email, password);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="h-screen bg-green-100 flex justify-center items-center">
        <div className="lg:w-2/5 md:w-1/2 w-2/3">
          <form className="bg-white p-10 rounded-lg shadow-lg min-w-full">
            <h1 className="text-center text-2xl mb-6 text-gray-600 font-bold font-sans">
              {login ? "로그인" : "회원가입"}
            </h1>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="text"
                name="email"
                id="email"
                placeholder="@email"
                value={email}
                onChange={onChange}
              />
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="password"
                name="password"
                id="password"
                placeholder="password"
                value={password}
                onChange={onChange}
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-green-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans"
              onClick={onSubmit}
            >
              {login ? "로그인" : "회원가입"}
            </button>
            <button
              type="submit"
              className="w-full mt-6 mb-3 bg-green-100 rounded-lg px-4 py-2 text-lg text-gray-800 tracking-wide font-semibold font-sans"
              onClick={(e) => {
                e.preventDefault();
                setLogin((prev) => !prev);
              }}
            >
              {login ? "회원가입" : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
