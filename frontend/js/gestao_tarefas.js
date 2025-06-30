const CHAVE = "tarefas_agenda";

// pega as tarefas que já estão salvas (se não tem, devolve lista vazia)
function pegarTarefas() {
  return JSON.parse(localStorage.getItem(CHAVE) || "[]");
}

// salva a lista de tarefas no navegador
function salvarTarefas(tarefas) {
  localStorage.setItem(CHAVE, JSON.stringify(tarefas));
}

// deixa a primeira letra maiúscula (tipo status)
function primeiraMaiuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// pega elementos do html pra usar no js
const corpoTabela = document.getElementById("tbodyTarefas");
const formFiltro = document.getElementById("formFiltro");
const filtroTitulo = document.getElementById("fTitulo");
const filtroData = document.getElementById("fData");
const filtroStatus = document.getElementById("fStatus");

const botaoNova = document.getElementById("btnNova");
const modal = document.getElementById("modalTarefa");
const modalTitulo = document.getElementById("modalTitulo");
const botaoCancelar = document.getElementById("btnCancelar");
const formTarefa = document.getElementById("formTarefa");
const campoId = document.getElementById("tarefaId");
const campoTitulo = document.getElementById("titulo");
const campoDescricao = document.getElementById("descricao");
const campoData = document.getElementById("data");
const campoHora = document.getElementById("hora");
const campoStatus = document.getElementById("status");

// função que mostra as tarefas na tabela (faz filtro se quiser)
function mostrarTabela() {
  const tarefas = pegarTarefas();
  // filtra se escrever algo nos campos de filtro
  const filtradas = tarefas.filter(function (t) {
    if (filtroTitulo.value && !t.titulo.toLowerCase().includes(filtroTitulo.value.toLowerCase())) return false;
    if (filtroData.value && t.data !== filtroData.value) return false;
    if (filtroStatus.value && t.status !== filtroStatus.value) return false;
    return true;
  });

  // se não tiver nenhuma tarefa mostra mensagem de vazio
  if (filtradas.length === 0) {
    corpoTabela.innerHTML = "<tr><td colspan=\"6\" style=\"text-align:center;color:#64748b;padding:32px;\">nenhuma tarefa encontrada.</td></tr>";
    return;
  }

  // monta a tabela colocando cada tarefa numa linha
  corpoTabela.innerHTML = filtradas.map(function (t) {
    return (
      "<tr>" +
        "<td>" + t.titulo + "</td>" +
        "<td>" + (t.descricao ? t.descricao.replace(/\n/g, "<br>") : "") + "</td>" +
        "<td>" + formatarDataPtBr(t.data) + "</td>" +
        "<td>" + t.hora + "</td>" +
        "<td><span class=\"status-chip " + t.status + "\">" + primeiraMaiuscula(t.status) + "</span></td>" +
        "<td style=\"text-align:center;\">" +
          // botões pra editar ou excluir tarefa
          "<button class=\"actions-btn\" title=\"Editar\" onclick=\"editarTarefa(" + t.id + ")\"><i class=\"fa-solid fa-pen\"></i></button>" +
          "<button class=\"actions-btn\" title=\"Excluir\" onclick=\"excluirTarefa(" + t.id + ")\"><i class=\"fa-solid fa-trash\"></i></button>" +
        "</td>" +
      "</tr>"
    );
  }).join("");
}

// abre o modal pra criar ou editar tarefa
function abrirModal(edicao, t) {
  modal.classList.remove("hidden");
  modalTitulo.textContent = edicao ? "Editar Tarefa" : "Nova Tarefa";
  campoId.value = t && t.id ? t.id : "";
  campoTitulo.value = t && t.titulo ? t.titulo : "";
  campoDescricao.value = t && t.descricao ? t.descricao : "";
  campoData.value = t && t.data ? t.data : "";
  campoHora.value = t && t.hora ? t.hora : "";
  campoStatus.value = t && t.status ? t.status : "pendente";
}

// fecha o modal e limpa os campos
function fecharModal() {
  modal.classList.add("hidden");
  formTarefa.reset();
}

// quando apertar em salvar, pega os dados e salva
function adicionarTarefa(e) {
  e.preventDefault();
  const tarefas = pegarTarefas();
  // se está editando usa o mesmo id, senão cria um novo com o timestamp
  const id = campoId.value ? Number(campoId.value) : Date.now();
  const nova = {
    id: id,
    titulo: campoTitulo.value.trim(),
    descricao: campoDescricao.value.trim(),
    data: campoData.value,
    hora: campoHora.value,
    status: campoStatus.value
  };
  // checa se preencheu os campos principais
  if (!nova.titulo || !nova.data || !nova.hora) {
    alert("preencha título, data e hora.");
    return;
  }
  // se for edição, substitui; se for novo, só adiciona
  const idx = tarefas.findIndex(function (t) { return t.id === id; });
  if (idx > -1) {
    tarefas[idx] = nova;
  } else {
    tarefas.push(nova);
  }
  salvarTarefas(tarefas);
  fecharModal();
  mostrarTabela();
}

// abre o modal pra editar tarefa já existente
function editarTarefa(id) {
  const tarefas = pegarTarefas();
  const t = tarefas.find(function (x) { return x.id === id; });
  if (t) abrirModal(true, t);
}

// apaga uma tarefa (depois de confirmar)
function excluirTarefa(id) {
  if (!confirm("deseja excluir esta tarefa?")) return;
  const tarefas = pegarTarefas().filter(function (t) { return t.id !== id; });
  salvarTarefas(tarefas);
  mostrarTabela();
}

// formata a data do jeito brasileiro (dd/mm/aaaa)
function formatarDataPtBr(iso) {
  if (!iso) return "";
  const partes = iso.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// eventos
botaoNova.addEventListener("click", function () { abrirModal(false); });
botaoCancelar.addEventListener("click", fecharModal);
formTarefa.addEventListener("submit", adicionarTarefa);
formFiltro.addEventListener("submit", function (e) { e.preventDefault(); mostrarTabela(); });
window.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.classList.contains("hidden")) fecharModal(); });
modal.addEventListener("click", function (e) { if (e.target === modal) fecharModal(); });

// deixa as funções de editar/excluir acessíveis pelo html
window.editarTarefa = editarTarefa;
window.excluirTarefa = excluirTarefa;

mostrarTabela();