import React, { useEffect, useMemo, useState } from "react";
import "../App.css";

const STORAGE_KEY = "rotina-treinador-simples-v1";

const habits = [
  { id: "academia", title: "Academia", time: "05:00 – 07:30", priority: "alta" },
  { id: "cafe", title: "Café da manhã", time: "até 07:45", priority: "alta" },
  { id: "deus", title: "Tempo com Deus", time: "10 minutos", priority: "alta" },
  { id: "trafego", title: "Estudo de tráfego", time: "mínimo 30 min", priority: "media" },
  { id: "foco", title: "Foco no trabalho", time: "a partir de 08:30", priority: "alta" },
  { id: "almoco", title: "Almoço", time: "12:00 – 13:00", priority: "media" },
  { id: "creatina", title: "Creatina", time: "diário", priority: "media" },
  { id: "whey", title: "Whey protein", time: "conforme rotina", priority: "baixa" },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function emptyDay() {
  return {
    habits: {},
    water: 0,
    mainTask: "",
    notes: "",
  };
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function weekDays() {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      date: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    };
  });
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(loadData());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, loaded]);

  const day = data[selectedDate] || emptyDay();
  const totalItems = habits.length + 1;
  const completedHabits = habits.filter((h) => day.habits?.[h.id]).length;
  const waterCompleted = day.water >= 6 ? 1 : 0;
  const completed = completedHabits + waterCompleted;
  const progress = Math.round((completed / totalItems) * 100);

  const missingHigh = habits.filter((h) => h.priority === "alta" && !day.habits?.[h.id]);

  const coachMessage = useMemo(() => {
    if (progress === 100) return "Dia fechado com excelência. Amanhã é repetir o básico bem feito.";
    if (missingHigh.length > 0) {
      return `Atenção: hoje você ainda precisa cuidar de ${missingHigh.map((h) => h.title).join(", ")}. Comece por uma prioridade alta.`;
    }
    if (day.water < 3) return "Água baixa. Beba mais água agora e marque os quadradinhos. Designer desidratado alinha tudo torto.";
    if (!day.mainTask.trim()) return "Defina a atividade principal do trabalho. Sem alvo, o dia vira bagunça com Wi-Fi.";
    return "Você está no caminho. Mantenha o ritmo e não deixe tarefa pequena virar bola de neve.";
  }, [progress, missingHigh, day.water, day.mainTask]);

  function updateDay(newDay) {
    setData((prev) => ({ ...prev, [selectedDate]: newDay }));
  }

  function toggleHabit(id) {
    updateDay({
      ...day,
      habits: {
        ...day.habits,
        [id]: !day.habits?.[id],
      },
    });
  }

  function setWater(value) {
    updateDay({ ...day, water: value });
  }

  function resetDay() {
    updateDay(emptyDay());
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Painel de comando</p>
          <h1>Rotina Treinador</h1>
          <p className="subtitle">Academia, fé, estudo, trabalho, água e disciplina diária.</p>
        </div>
        <div className="score">
          <span>Cumprimento</span>
          <strong>{progress}%</strong>
        </div>
      </header>

      <section className="coach">
        <strong>Treinador do dia:</strong>
        <p>{coachMessage}</p>
      </section>

      <section className="week">
        {weekDays().map((d) => {
          const active = selectedDate === d.key;
          return (
            <button key={d.key} onClick={() => setSelectedDate(d.key)} className={active ? "active" : ""}>
              <span>{d.label}</span>
              <strong>{d.date}</strong>
            </button>
          );
        })}
      </section>

      <main className="grid">
        <section className="card">
          <h2>Checklist do dia</h2>
          <div className="list">
            {habits.map((habit) => {
              const checked = !!day.habits?.[habit.id];
              return (
                <button
                  key={habit.id}
                  className={checked ? "habit checked" : "habit"}
                  onClick={() => toggleHabit(habit.id)}
                >
                  <div>
                    <strong>{habit.title}</strong>
                    <span>{habit.time}</span>
                  </div>
                  <b>{checked ? "✓" : "○"}</b>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="side">
          <section className="card">
            <h2>Água</h2>
            <p>Meta diária: 3 litros. Cada botão vale 500ml.</p>
            <div className="water">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button key={n} onClick={() => setWater(n)} className={day.water >= n ? "filled" : ""}>
                  {n}
                </button>
              ))}
            </div>
            <button className="secondary" onClick={() => setWater(0)}>Zerar água</button>
          </section>

          <section className="card">
            <h2>Atividade principal</h2>
            <textarea
              value={day.mainTask}
              onChange={(e) => updateDay({ ...day, mainTask: e.target.value })}
              placeholder="Ex: finalizar arte do cliente, orçamento, campanha, estudo..."
            />
          </section>

          <section className="card">
            <h2>Observações</h2>
            <textarea
              value={day.notes}
              onChange={(e) => updateDay({ ...day, notes: e.target.value })}
              placeholder="O que funcionou? O que atrapalhou? O que melhorar amanhã?"
            />
          </section>

          <section className="card">
            <h2>Resumo</h2>
            <p>{completed} de {totalItems} blocos concluídos.</p>
            <button className="danger" onClick={resetDay}>Limpar este dia</button>
          </section>
        </aside>
      </main>
    </div>
  );
}
