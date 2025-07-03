// Pega a data de hoje no formato dd/mm/yyyy
const hoje = new Date();
const dataHoje = hoje.toLocaleDateString("pt-BR");

// Função para pegar tarefas do localStorage (do projeto antigo, com título, data, hora, etc)
function pegarTarefas() {
  return JSON.parse(localStorage.getItem("tarefas_agenda") || "[]");
}

// Função para mostrar só as tarefas de hoje no container "listaHoje"
function mostrarTarefasDoDia() {
  const tarefas = pegarTarefas();

  // Filtra só as tarefas cuja data bate com a de hoje
  const tarefasHoje = tarefas.filter(tarefa => {
    // Aqui convertendo a data de yyyy-mm-dd (formato esperado no tarefas_agenda) para dd/mm/yyyy
    const dataFormatada = tarefa.data.includes("-") ? tarefa.data.split("-").reverse().join("/") : tarefa.data;
    return dataFormatada === dataHoje;
  });

  const container = document.getElementById("listaHoje");
  container.innerHTML = "";

  if (tarefasHoje.length === 0) {
    container.innerHTML = "<p>Nenhuma tarefa para hoje.</p>";
    return;
  }

  tarefasHoje.forEach(tarefa => {
    const div = document.createElement("div");
    div.classList.add("tarefa");
    div.innerHTML = `
      <strong>${tarefa.titulo}</strong> <br>
      <small>${tarefa.data} ${tarefa.hora || ''}</small><br>
      <em>${tarefa.status ? tarefa.status.charAt(0).toUpperCase() + tarefa.status.slice(1) : ''}</em><br>
      <p>${tarefa.descricao ? tarefa.descricao.replace(/\n/g, "<br>") : ''}</p>
    `;
    container.appendChild(div);
  });
}

window.onload = function() {
  alert("Bem-vindo(a) a sua agenda!");
  mostrarTarefasDoDia();
};


// Chama pra mostrar as tarefas de hoje ao carregar o script
mostrarTarefasDoDia();
