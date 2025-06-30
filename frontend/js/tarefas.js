// pega as tarefas salvas no localstorage
function pegarTarefas() {
  return JSON.parse(localStorage.getItem("tarefas_agenda") || "[]");
}

// deixa a primeira letra maiúscula
function primeiraMaiuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// pega o elemento da lista onde vai mostrar todas as tarefas
const listaTodas = document.getElementById("listaTodas");

// função para mostrar todas as tarefas já salvas
function mostrarTodas() {
  // pega todas as tarefas e coloca em ordem pela data e hora
  const todas = pegarTarefas().sort(function (a, b) {
    return (a.data + a.hora).localeCompare(b.data + b.hora);
  });

  // se não tiver nenhuma tarefa, mostra uma mensagem
  if (todas.length === 0) {
    listaTodas.innerHTML = "<p>Nenhuma tarefa cadastrada.</p>";
    return;
  }

  // monta o html de cada tarefa
  listaTodas.innerHTML = todas.map(function (tarefa) {
    return (
      "<div class=\"tarefa-item\" onclick=\"this.classList.toggle('open')\">" +
        "<div class=\"tarefa-header\">" +
          "<div class=\"tarefa-info\">" +
            "<div class=\"tarefa-titulo\">" + tarefa.titulo + "</div>" +
            "<div class=\"tarefa-meta\">" +
              tarefa.data.split("-").reverse().join("/") + " " + tarefa.hora +
            "</div>" +
          "</div>" +
          "<span class=\"status-chip " + tarefa.status + "\">" + primeiraMaiuscula(tarefa.status) + "</span>" +
        "</div>" +
        "<div class=\"tarefa-desc\">" + (tarefa.descricao ? tarefa.descricao.replace(/\n/g, "<br>") : "<em>Sem descrição.</em>") + "</div>" +
      "</div>"
    );
  }).join("");
}

mostrarTodas();
