import { useState } from "react";
import { useRoutes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import routes from "./routes";

function App() {
  let element = useRoutes(routes);

  return <div>{element}</div>;
}

export default App;
