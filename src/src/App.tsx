import "./App.css";

export default function App() {
  return (
    <div className="container">
      <div className="card">
        <h1>Rotina Treinador</h1>
        <p>Painel de disciplina diária</p>

        <div className="tasks">
          <label><input type="checkbox" /> Academia</label>
          <label><input type="checkbox" /> Café da manhã</label>
          <label><input type="checkbox" /> Tempo com Deus</label>
          <label><input type="checkbox" /> Estudo de tráfego</label>
          <label><input type="checkbox" /> Foco no trabalho</label>
          <label><input type="checkbox" /> Água</label>
          <label><input type="checkbox" /> Creatina</label>
          <label><input type="checkbox" /> Whey protein</label>
        </div>
      </div>
    </div>
  );
}
