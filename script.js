const cardapios = {
  segunda: {
    titulo: "Cardápio de Segunda-feira",
    pratos: [
      { nome: "Arroz, feijão, bife acebolado, salada de alface", preco: "R$ 22,90" },
      { nome: "Opção vegetariana: Omelete de legumes", preco: "R$ 19,90" }
    ]
  },
  terca: {
    titulo: "Cardápio de Terça-feira",
    pratos: [
      { nome: "Arroz, feijão, frango grelhado, salada de tomate", preco: "R$ 21,90" },
      { nome: "Opção vegetariana: Lasanha de berinjela", preco: "R$ 20,90" }
    ]
  },
  quarta: {
    titulo: "Cardápio de Quarta-feira",
    pratos: [
      { nome: "Arroz, feijão, carne moída, legumes cozidos", preco: "R$ 20,90" },
      { nome: "Opção vegetariana: Estrogonofe de grão-de-bico", preco: "R$ 19,90" }
    ]
  },
  quinta: {
    titulo: "Cardápio de Quinta-feira",
    pratos: [
      { nome: "Arroz, feijão, filé de peixe, salada de repolho", preco: "R$ 23,90" },
      { nome: "Opção vegetariana: Quibe de abóbora", preco: "R$ 19,90" }
    ]
  },
  sexta: {
    titulo: "Cardápio de Sexta-feira",
    pratos: [
      { nome: "Arroz, feijão, costela assada, mandioca", preco: "R$ 26,90" },
      { nome: "Opção vegetariana: Tofu grelhado com legumes", preco: "R$ 21,90" }
    ]
  },
  sabado: {
    titulo: "Cardápio de Sábado",
    pratos: [
      { nome: "Arroz, feijão, fraldinha na manteiga, vinagrete", preco: "R$ 27,90" },
      { nome: "Opção vegetariana: Panqueca de espinafre", preco: "R$ 22,90" }
    ]
  }
};

const lanchonete = [
  { nome: "Pão com queijo", preco: "R$ 8,00" },
  { nome: "Misto quente", preco: "R$ 9,90" },
  { nome: "Lanche natural", preco: "R$ 10,00" },
  { nome: "Suco natural", preco: "R$ 6,00" },
  { nome: "Café com leite", preco: "R$ 4,00" }
];

function mostrarLanchonete() {
  document.getElementById('inicio').style.display = 'none';
  const lanchoneteLista = document.getElementById('lanchonete-lista');
  lanchoneteLista.innerHTML = '';
  lanchonete.forEach(item => {
    lanchoneteLista.innerHTML += `<li>${item.nome} - <strong>${item.preco}</strong></li>`;
  });
  document.getElementById('lanchonete').style.display = 'flex';
}

function mostrarRestaurante() {
  document.getElementById('inicio').style.display = 'none';
  document.getElementById('restaurante').style.display = 'flex';
}

function mostrarCardapio(dia) {
  document.getElementById('restaurante').style.display = 'none';
  const cardapioDiv = document.getElementById('cardapio');
  const data = cardapios[dia];
  cardapioDiv.innerHTML = `
    <h2>${data.titulo}</h2>
    <ul>
      ${data.pratos.map(prato => `<li>${prato.nome} - <strong>${prato.preco}</strong></li>`).join("")}
    </ul>
    <button class="voltar" onclick="voltarRestaurante()">⬅ Voltar</button>`;
  cardapioDiv.style.display = 'flex';
}

function voltarInicio() {
  document.getElementById('lanchonete').style.display = 'none';
  document.getElementById('restaurante').style.display = 'none';
  document.getElementById('cardapio').style.display = 'none';
  document.getElementById('inicio').style.display = 'block';
}

function voltarRestaurante() {
  document.getElementById('cardapio').style.display = 'none';
  document.getElementById('restaurante').style.display = 'flex';
}
