import {Routes} from "react-router-dom";
import Container from "@mui/material/Container";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";

function App() {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Home />
          <Routes>
            <Routes path = '/' element = {<Home />}/>
            <Routes path = '/posts/:id' element = {<FullPost/>}/>
            <Routes path = '/add-post' element = {<AddPost/>}/>
            <Routes path = '/login' element = {<Login/>}/>  
            <Routes path = '/register' element = {<Registration/>}/>
          </Routes>
      </Container>
    </>
  );
}

export default App;
