
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login'
import Signup from './Pages/Signup';
import Landing from './Pages/Landing';
import Data from './ContexApi';
import { useState } from 'react';

function App() {

  const [userData, setUserData] = useState(false)
  const [registerData, setRegisterData] = useState(false)
  const [addProjectbtn, setaddProjectbtn] = useState(false)
  console.log(userData)
  console.log(registerData)
  return (
    <>
      <Data.Provider value={{setUserData,userData,setRegisterData , registerData , setaddProjectbtn , addProjectbtn}} >
        <BrowserRouter>
       
          <Routes>

            <Route path='/' element={<Login></Login>}></Route>
            <Route path='/signup' element={<Signup></Signup>}></Route>
            <Route path='/landing' element={<Landing></Landing>}></Route>


          </Routes>

        </BrowserRouter>



      </Data.Provider>


    </>
  );
}

export default App;
