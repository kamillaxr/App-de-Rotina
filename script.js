// 💛 FRASES CARINHOSAS
const frasesCarinho = [
    { emoji: "🌟", texto: "Você fez isso! 💛" },
    { emoji: "💫", texto: "Cada passo já é vitória ✨" },
    { emoji: "🌈", texto: "Seu melhor já é suficiente 💜" },
    { emoji: "🦋", texto: "Um dia de cada vez 💛" },
    { emoji: "☀️", texto: "Você é luz, sabia? ✨" },
    { emoji: "💎", texto: "Precioso esforço 💎" }
];

// 📋 DADOS
let rotina = {
    manha: ["☀️ Respirar fundo", "☕ Tomar algo gostoso", "👗 Roupa confortável", "💊 Remédio TDAH"],
    tarde: ["📝 Uma coisa de cada vez", "🍎 Comer bem", "🎵 Ouvir música", "💛 Respirar se ficar difícil"],
    noite: ["🛁 Quentinha e confortável", "📱 Diminuir luz", "💊 Remédio ansiedade", "💤 Descansar"]
};
let eventos = {};
let registrosDor = [];
let dataAtual = new Date();
let dataSelecionada = null;
let eventoParaSalvar = null;
let lembretesAtivos = false;
let tempoAntecedencia = 0;
let horariosRotina = { manha: null, tarde: null, noite: null };

// 💊 REMÉDIOS
let estadoRemedios = {
    data: new Date().toLocaleDateString('pt-BR'),
    tdah: { tomado: false, hora: null },
    ansiedade: { tomado: false, hora: null }
};

// 🔐 SALVAR/CARREGAR
function carregarDados() {
    const r = localStorage.getItem('rotinaApp');
    const e = localStorage.getItem('eventosApp');
    const d = localStorage.getItem('dorApp');
    const rem = localStorage.getItem('remediosApp');
    const c = localStorage.getItem('configApp');
    
    if (r) rotina = JSON.parse(r);
    if (e) eventos = JSON.parse(e);
    if (d) registrosDor = JSON.parse(d);
    if (rem) {
        const salvo = JSON.parse(rem);
        if (salvo.data === new Date().toLocaleDateString('pt-BR')) {
            estadoRemedios = salvo;
        } else {
            estadoRemedios = {
                data: new Date().toLocaleDateString('pt-BR'),
                tdah: { tomado: false, hora: null },
                ansiedade: { tomado: false, hora: null }
            };
        }
    }
    if (c) {
        const cfg = JSON.parse(c);
        lembretesAtivos = cfg.ativos || false;
        tempoAntecedencia = cfg.tempo || 0;
        horariosRotina = cfg.horarios || {};
    }
}
function salvarTudo() {
    localStorage.setItem('rotinaApp', JSON.stringify(rotina));
    localStorage.setItem('eventosApp', JSON.stringify(eventos));
    localStorage.setItem('dorApp', JSON.stringify(registrosDor));
    localStorage.setItem('remediosApp', JSON.stringify(estadoRemedios));
    localStorage.setItem('configApp', JSON.stringify({
        ativos: lembretesAtivos,
        tempo: tempoAntecedencia,
        horarios: horariosRotina
    }));
}
carregarDados();

// 🧩 ELEMENTOS
const botoesAba = document.querySelectorAll('.aba');
const conteudosAba = document.querySelectorAll('.conteudo-aba');
const botaoDescansar = document.getElementById('botao-descansar');
const botaoDorCabeca = document.getElementById('botao-dor-cabeca');
const telaDescansar = document.getElementById('tela-descansar');
const telaDorCabeca = document.getElementById('tela-dor-cabeca');
const botaoAcordar = document.getElementById('botao-acordar');
const conteudoPrincipal = document.getElementById('conteudo-principal');

// 💊 Remédios
const tomouTdah = document.getElementById('tomou-tdah');
const tomouAnsiedade = document.getElementById('tomou-ansiedade');
const etiquetaTdah = document.getElementById('etiqueta-tdah');
const etiquetaAnsiedade = document.getElementById('etiqueta-ansiedade');
const ultimaTdah = document.getElementById('ultima-tdah');
const ultimaAnsiedade = document.getElementById('ultima-ansiedade');
const cartaoTdah = document.querySelector('.remedio-azul');
const cartaoAnsiedade = document.querySelector('.remedio-branco');

// 📅 Calendário
const nomeMesAno = document.getElementById('nome-mes-ano');
const gradeCalendario = document.getElementById('grade-calendario');
const caixaEvento = document.getElementById('caixa-evento');
const nomeEventoEl = document.getElementById('nome-evento');
const horaEventoEl = document.getElementById('hora-evento');
const listaEventosDia = document.getElementById('lista-eventos-dia');
const sobreposicao = document.getElementById('sobreposicao');
const avisoSobrecarga = document.getElementById('aviso-sobrecarga');

// 🔄 Navegação Abas
botoesAba.forEach(aba => {
    aba.addEventListener('click', () => {
        botoesAba.forEach(b => b.classList.remove('ativa'));
        aba.classList.add('ativa');
        const qual = aba.dataset.aba;
        conteudosAba.forEach(c => c.classList.add('tela-oculta'));
        document.getElementById(`aba-${qual}`).classList.remove('tela-oculta');
        telaDescansar.classList.add('tela-oculta');
        telaDorCabeca.classList.add('tela-oculta');
        conteudoPrincipal.style.display = 'block';
        if (qual === 'remedios') atualizarTelaRemedios();
        if (qual === 'calendario') desenharCalendario();
    });
});

// 💤 Descanso
botaoDescansar.addEventListener('click', () => {
    conteudoPrincipal.style.display = 'none';
    telaDorCabeca.classList.add('tela-oculta');
    telaDescansar.classList.remove('tela-oculta');
});
botaoAcordar.addEventListener('click', () => {
    telaDescansar.classList.add('tela-oculta');
    conteudoPrincipal.style.display = 'block';
});

// 🤕 Dor de Cabeça
botaoDorCabeca.addEventListener('click', () => {
    conteudoPrincipal.style.display = 'none';
    telaDescansar.classList.add('tela-oculta');
    telaDorCabeca.classList.remove('tela-oculta');
    carregarHistoricoDor();
});
document.getElementById('cancelar-dor').addEventListener('click', () => {
    telaDorCabeca.classList.add('tela-oculta');
    conteudoPrincipal.style.display = 'block';
});
document.getElementById('salvar-dor').addEventListener('click', () => {
    const sel = document.querySelector('input[name="intensidade"]:checked');
    if (!sel) { alert('Escolha a intensidade 💛'); return; }
    registrosDor.unshift({
        id: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}),
        intensidade: sel.value,
        obs: document.getElementById('observacao-dor').value.trim()
    });
    salvarTudo();
    carregarHistoricoDor();
    document.querySelectorAll('input[name="intensidade"]').forEach(r => r.checked = false);
    document.getElementById('observacao-dor').value = '';
    alert('Registrado 💛 Cuide de você 🫂');
});

function carregarHistoricoDor() {
    const lista = document.getElementById('lista-historico-dor');
    lista.innerHTML = '';
    if (registrosDor.length === 0) {
        lista.innerHTML = '<li style="justify-content:center; color:#999;">Nenhum registro 💛</li>';
        return;
    }
    registrosDor.forEach(reg => {
        const cor = {leve:'🟢', moderada:'🟡', forte:'🔴'}[reg.intensidade];
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <div style="font-size:0.8rem; color:#999;">${reg.data} às ${reg.hora}</div>
                <div style="font-weight:600;">${cor} ${reg.intensidade}</div>
                ${reg.obs ? `<small style="color:#777;">${reg.obs}</small>` : ''}
            </div>
            <button class="botao-apagar-registro" data-id="${reg.id}">✕</button>
        `;
        li.querySelector('.botao-apagar-registro').addEventListener('click', () => {
            registrosDor = registrosDor.filter(r => r.id !== reg.id);
            salvarTudo();
            carregarHistoricoDor();
        });
        lista.appendChild(li);
    });
}

// 💊 Remédios
function atualizarTelaRemedios() {
    tomouTdah.checked = estadoRemedios.tdah.tomado;
    if (estadoRemedios.tdah.tomado) {
        etiquetaTdah.textContent = '✅ Tomei! 💙';
        etiquetaTdah.style.color = '#2E7D32';
        cartaoTdah.classList.add('tomado');
        ultimaTdah.textContent = `Tomado às ${estadoRemedios.tdah.hora}`;
    } else {
        etiquetaTdah.textContent = 'Ainda não tomei';
        etiquetaTdah.style.color = '#757575';
        cartaoTdah.classList.remove('tomado');
        ultimaTdah.textContent = '';
    }

    tomouAnsiedade.checked = estadoRemedios.ansiedade.tomado;
    if (estadoRemedios.ansiedade.tomado) {
        etiquetaAnsiedade.textContent = '✅ Tomei! 🤍';
        etiquetaAnsiedade.style.color = '#2E7D32';
        cartaoAnsiedade.classList.add('tomado');
        ultimaAnsiedade.textContent = `Tomado às ${estadoRemedios.ansiedade.hora}`;
    } else {
        etiquetaAnsiedade.textContent = 'Ainda não tomei';
        etiquetaAnsiedade.style.color = '#757575';
        cartaoAnsiedade.classList.remove('tomado');
        ultimaAnsiedade.textContent = '';
    }
}

tomouTdah.addEventListener('change', () => {
    estadoRemedios.tdah.tomado = tomouTdah.checked;
    estadoRemedios.tdah.hora = tomouTdah.checked 
        ? new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) : null;
    salvarTudo();
    atualizarTelaRemedios();
    if (tomouTdah.checked) alert('💙 Muito bem! 💛');
});

tomouAnsiedade.addEventListener('change', () => {
    estadoRemedios.ansiedade.tomado = tomouAnsiedade.checked;
    estadoRemedios.ansiedade.hora = tomouAnsiedade.checked 
        ? new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) : null;
    salvarTudo();
    atualizarTelaRemedios();
    if (tomouAnsiedade.checked) alert('🤍 Bom descanso 💛');
});

// 📋 Rotina
const botoesPeriodo = document.querySelectorAll('.botao-periodo');
const listaTarefas = document.getElementById('tarefas');
let periodoAtual = null;

botoesPeriodo.forEach(b => b.addEventListener('click', () => {
    botoesPeriodo.forEach(x => x.classList.remove('ativo'));
    b.classList.add('ativo');
    periodoAtual = b.dataset.periodo;
    carregarTarefas(periodoAtual);
}));

document.getElementById('botao-adicionar').addEventListener('click', adicionarTarefa);
document.getElementById('nova-tarefa').addEventListener('keypress', e => e.key === 'Enter' && adicionarTarefa());

function adicionarTarefa() {
    const txt = document.getElementById('nova-tarefa').value.trim();
    if (!txt) return;
    if (!periodoAtual) { alert('Escolha manhã/tarde/noite 💛'); return; }
    rotina[periodoAtual].push(txt);
    salvarTudo();
    document.getElementById('nova-tarefa').value = '';
    carregarTarefas(periodoAtual);
}

function carregarTarefas(p) {
    listaTarefas.innerHTML = '';
    const nomes = {manha:'☀️ Manhã', tarde:'🌤️ Tarde', noite:'🌙 Noite'};
    document.getElementById('titulo-periodo').textContent = nomes[p];
    rotina[p].forEach((texto, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${texto}</span><button class="botao-apagar">✕</button>`;
        li.querySelector('span').addEventListener('click', () => li.classList.toggle('feita'));
        li.querySelector('.botao-apagar').addEventListener('click', e => {
            e.stopPropagation();
            rotina[p].splice(i, 1);
            salvarTudo();
            carregarTarefas(p);
        });
        listaTarefas.appendChild(li);
    });
}

// 📅 Calendário
document.getElementById('mes-anterior').addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    desenharCalendario();
});
document.getElementById('proximo-mes').addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    desenharCalendario();
});

function desenharCalendario() {
    const ano = dataAtual.getFullYear(), mes = dataAtual.getMonth();
    nomeMesAno.textContent = new Date(ano, mes).toLocaleDateString('pt-BR', {month:'long', year:'numeric'});
    const primeiro = new Date(ano, mes, 1).getDay();
    const diasMes = new Date(ano, mes+1, 0).getDate();
    const ultimoAnterior = new Date(ano, mes, 0).getDate();
    const hoje = new Date();
    gradeCalendario.innerHTML = '';
    
    for (let i = primeiro-1; i >= 0; i--) criarCelula(ultimoAnterior - i, true);
    for (let d = 1; d <= diasMes; d++) {
        const chave = `${ano}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const qtd = (eventos[chave] || []).length;
        const ehHoje = hoje.getDate() === d && hoje.getMonth() === mes && hoje.getFullYear() === ano;
        criarCelula(d, false, chave, ehHoje, qtd);
    }
    const total = gradeCalendario.children.length;
    const restantes = total % 7 === 0 ? 0 : 7 - (total % 7);
    for (let i = 1; i <= restantes; i++) criarCelula(i, true);
}

function criarCelula(num, outroMes, chave=null, ehHoje=false, qtd=0) {
    const cel = document.createElement('div');
    cel.classList.add('dia-calendario');
    if (outroMes) cel.classList.add('outro-mes');
    if (ehHoje) cel.classList.add('hoje');
    if (qtd >= 1) { cel.classList.add('tem-evento'); if (qtd >=2) cel.classList.add('muitos-eventos'); }
    cel.textContent = num;
    if (chave) cel.addEventListener('click', () => abrirEvento(chave));
    gradeCalendario.appendChild(cel);
}

function abrirEvento(chave) {
    dataSelecionada = chave;
    const [a, m, d] = chave.split('-');
    document.getElementById('data-selecionada').textContent = `${d}/${m}/${a}`;
    nomeEventoEl.value = '';
    horaEventoEl.value = '';
    caixaEvento.classList.remove('tela-oculta');
    carregarEventos(chave);
}

function carregarEventos(chave) {
    listaEventosDia.innerHTML = '';
    (eventos[chave] || []).forEach((ev, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong style="color:#666;">${ev.hora || ''}</strong> ${ev.nome}</span>
            <button class="botao-apagar" data-i="${idx}">✕</button>
        `;
        li.querySelector('.botao-apagar').addEventListener('click', () => {
            eventos[chave].splice(idx, 1);
            if (!eventos[chave].length) delete eventos[chave];
            salvarTudo();
            carregarEventos(chave);
            desenharCalendario();
        });
        listaEventosDia.appendChild(li);
    });
}

document.getElementById('salvar-evento').addEventListener('click', () => {
    const nome = nomeEventoEl.value.trim();
    if (!nome) { alert('Digite o nome 💛'); return; }
    const lista = eventos[dataSelecionada] || [];
    const novo = { nome, hora: horaEventoEl.value || null };
    
    if (lista.length >= 1) {
        eventoParaSalvar = novo;
        document.getElementById('quantos-eventos').textContent = lista.length;
        sobreposicao.classList.remove('tela-oculta');
        avisoSobrecarga.classList.remove('tela-oculta');
        return;
    }
    
    if (!eventos[dataSelecionada]) eventos[dataSelecionada] = [];
    eventos[dataSelecionada].push(novo);
    salvarTudo();
    nomeEventoEl.value = '';
    carregarEventos(dataSelecionada);
    desenharCalendario();
});

document.getElementById('pensar-melhor').addEventListener('click', () => {
    sobreposicao.classList.add('tela-oculta');
    avisoSobrecarga.classList.add('tela-oculta');
    eventoParaSalvar = null;
});

document.getElementById('confirmar-adicionar').addEventListener('click', () => {
    sobreposicao.classList.add('tela-oculta');
    avisoSobrecarga.classList.add('tela-oculta');
    if (!eventos[dataSelecionada]) eventos[dataSelecionada] = [];
    eventos[dataSelecionada].push(eventoParaSalvar);
    salvarTudo();
    carregarEventos(dataSelecionada);
    desenharCalendario();
    eventoParaSalvar = null;
});

document.getElementById('cancelar-evento').addEventListener('click', () => {
    caixaEvento.classList.add('tela-oculta');
});