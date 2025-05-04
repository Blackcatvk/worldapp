import React, { useState } from 'react';
import { IDKitWidget } from '@worldcoin/idkit';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './App.css';
import logo from './logo.svg'; // Importamos el logo como en el template original

function App() {
  const [count, setCount] = useState(0);

  // Manejo de verificación de World ID
  const handleVerify = async (proof) => {
    const nullifier = proof.nullifier_hash;
    if (!nullifier) {
      alert("Verificación fallida");
      return;
    }

    try {
      const userRef = doc(db, "usuarios", nullifier);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          monedasWCatCon: 100,
          terrenos: [],
          creado: new Date().toISOString()
        });
        alert("✅ Perfil creado con 100 monedas WLD");
      } else {
        alert("👋 Bienvenido de nuevo. Ya tienes un perfil.");
      }
    } catch (error) {
      console.error("❌ Error al guardar datos:", error);
      alert("Error al guardar datos del usuario");
    }
  };

  const handleSuccess = (result) => {
    console.log("✅ Verificación exitosa:", result);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Logo del template */}
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Bienvenido a WorldCat Conquest</h1>
        <button onClick={() => setCount(count + 1)} className="App-button">
          Clicks: {count}
        </button>
        <p>Obtén terrenos y gana monedas WLD</p>

        {/* Widget de verificación de World ID */}
        <IDKitWidget
          app_id="app_9107e5e1f88c0e8e568869ccb2fa3fed"
          action="worldapp_login"
          signal="ingresoapp"
          handleVerify={handleVerify}
          onSuccess={handleSuccess}
          onError={(err) => {
            console.error("❌ Error en World ID:", err);
            alert("Error con la verificación");
          }}
        >
          {({ open }) => <button onClick={open} className="App-button">Verificar con World ID</button>}
        </IDKitWidget>
      </header>
    </div>
  );
}

export default App;