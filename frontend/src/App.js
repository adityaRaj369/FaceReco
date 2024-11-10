// frontend/src/App.js
import React from 'react';
import RegisterFace from './components/RegisterFace';
import PayToContacts from './components/PayToContacts';

function App() {
    return (
        <div>
            <h1>Face Payment App</h1>
            <RegisterFace />
            <PayToContacts />
        </div>
    );
}

export default App;