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

// Agendar a execução todos os dias às 20:35
cron.schedule("44 20 * * *", () => {
  console.log("🕒 Executando exclusão automática...");
  excluirTodosDados();
});

// Mantém o processo rodando
console.log("🚀 Script executado com sucesso!");
