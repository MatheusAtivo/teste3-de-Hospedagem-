if (window.__firebaseSyncInitialized) {
  console.log('firebase-sync: already initialized, skipping');
} else {
  (async () => {
    try {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js');
      const dbModule = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js');
      const { getDatabase, ref, onValue, set, update, get, remove } = dbModule;

      const firebaseConfig = {
        apiKey: "AIzaSyBzgQWppMnHjViNBWmMScosCiqpbWwM2cs",
        authDomain: "teste2-4fba0.firebaseapp.com",
        databaseURL: "https://teste2-4fba0-default-rtdb.firebaseio.com",
        projectId: "teste2-4fba0",
        storageBucket: "teste2-4fba0.firebasestorage.app",
        messagingSenderId: "377217947127",
        appId: "1:377217947127:web:a7b0ec02e2d188ffa8caf2",
        measurementId: "G-DXBRNTD5LT"
      };

      const app = initializeApp(firebaseConfig);
      const db = getDatabase(app);

      function dbRef(path) { return ref(db, path); }

      function codigosObjToArray(obj) {
        if (!obj) return [];
        return Object.keys(obj).map(k => ({ codigo: k, ...obj[k] }));
      }

      // listeners
      try {
        onValue(dbRef('codigos'), (snap) => {
          try {
            const val = snap.val() || {};
            const arr = codigosObjToArray(val);
            window.codigos = arr;
            window.codigosMap = val;
            try { localStorage.setItem('codigos', JSON.stringify(arr)); } catch (e) { console.warn('Falha ao gravar localStorage codigos:', e); }
            try { window.dispatchEvent(new CustomEvent('firebaseSync:codigos', { detail: { arr, map: val } })); } catch (e) {}
          } catch (e) { console.warn('Erro no listener codigos:', e); }
        });
      } catch (e) { console.warn('Erro ao registrar listener codigos:', e); }

      try {
        onValue(dbRef('coisas1'), (snap) => {
          try {
            const val = snap.val() || {};
            window.coisas1 = val;
            try { localStorage.setItem('coisas1', JSON.stringify(val)); } catch (e) { console.warn('Falha ao gravar localStorage coisas1:', e); }
            try { window.dispatchEvent(new CustomEvent('firebaseSync:coisas1', { detail: { map: val } })); } catch (e) {}
          } catch (e) { console.warn('Erro no listener coisas1:', e); }
        });
      } catch (e) { console.warn('Erro ao registrar listener coisas1:', e); }

      // safe writers: only define if not present to avoid interfering
      if (!window.addCodigo) {
        window.addCodigo = async function (codigoObj) {
          if (!codigoObj || !codigoObj.codigo) throw new Error('codigoObj precisa ter a propriedade codigo');
          const codigo = codigoObj.codigo;
          const payload = { nome: codigoObj.nome || null, etapa: codigoObj.etapa || 1, createdAt: codigoObj.createdAt || Date.now() };
          await set(dbRef(`codigos/${codigo}`), payload);
          await set(dbRef(`coisas1/${codigo}`), payload.etapa);
        };
      }

      if (!window.updateCodigoEtapa) {
        window.updateCodigoEtapa = async function (codigo, etapa) {
          if (!codigo) throw new Error('codigo é obrigatório');
          await update(dbRef(`codigos/${codigo}`), { etapa });
          await set(dbRef(`coisas1/${codigo}`), etapa);
        };
      }

      if (!window.resetCodigos) {
        window.resetCodigos = async function () {
          await set(dbRef('codigos'), null);
          await set(dbRef('coisas1'), null);
        };
      }

      if (!window.getCodigosOnce) {
        window.getCodigosOnce = async function () {
          const snap = await get(dbRef('codigos'));
          const val = snap.val() || {};
          return codigosObjToArray(val);
        };
      }

      if (!window.removeCodigo) {
        window.removeCodigo = async function (codigo) {
          if (!codigo) throw new Error('codigo é obrigatório');
          await remove(dbRef(`codigos/${codigo}`));
          await remove(dbRef(`coisas1/${codigo}`));
        };
      }

      window.__firebaseSyncInitialized = true;
      console.log('firebase-sync initialized: realtime listeners active');

    } catch (e) {
      console.warn('firebase-sync internal error:', e);
    }
  })();
}
