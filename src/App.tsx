import React from 'react';
import Form from './Components/Form';
import logo from "./logo.svg";

const App = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 items-center overflow-auto">
      <div className="m-4 p-8 mx-auto bg-white shadow-lg rounded-xl">
        <div className="flex gap-2 items-center ">
          <img className="h-16 w-16 animate-spin-slow" src={logo} alt="logo" />
          <h1 className="text-center text-xl">Welcome to Lesson 5 $react-typescript with #tailwindcss </h1>
        </div>
        <Form />
      </div>
    </div>
  );
}

export default App;
