import { initializeApp } from "firebase/app"; // Importa o Firebase
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore"; // Importa o Firestore e funções necessárias
import cron from "node-cron";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyANCv8NIpG7vpvD9_cxwQODFl4BoYisku8",
  authDomain: "ata-bus-252a6.firebaseapp.com",
  projectId: "ata-bus-252a6",
  storageBucket: "ata-bus-252a6.firebasestorage.app",
  messagingSenderId: "1006487639443",
  appId: "1:1006487639443:web:b4af09a43464ddf82c0466",
  measurementId: "G-G45G2MPFMM"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para excluir todos os dados da coleção "ataAtual"
async function excluirTodosDados() {
  try {
    const querySnapshot = await getDocs(collection(db, "ataAtual"));
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "ataAtual", docSnapshot.id));
    });
    console.log("✅ Todos os dados foram excluídos às", new Date().toLocaleTimeString("pt-BR"));
  } catch (error) {
    console.error("❌ Erro ao excluir os dados:", error);
  }
}

// Função para agendar a execução com base no horário da API
async function agendarExclusao() {
  try {
    const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Sao_Paulo');
    const data = await response.json();
    
    const horarioBrasilia = new Date(data.dateTime);
    const hora = horarioBrasilia.getHours();
    const minuto = horarioBrasilia.getMinutes();

    // Verifica se o horário atual é 20:35
    if (hora === 20 && minuto === 49) {
      console.log("🕒 Executando exclusão automática...");
      await excluirTodosDados();
    } else {
      console.log(`🕒 O horário de execução será às 20:35. Hora atual: ${hora}:${minuto}`);
    }
  } catch (error) {
    console.error("❌ Erro ao obter o horário da API:", error);
  }
}

// Verifica o horário a cada minuto
cron.schedule("* * * * *", () => {
  agendarExclusao();
});

// Mantém o processo rodando
console.log("🚀 Script executado com sucesso!");
