// A URL base da sua planilha publicada.
// Ajustada para pegar a URL para download CSV, que é o formato que o script espera.
const BASE_URL_PLANILHA = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkXW3QVN3BH2OMKO3GzAJKMABTsjPRvjBZMrL6xUqIhJSxTJ8r68bdbLgP4ZaK3OA3DaI29LlbA800/pub?output=csv';

// GIDs das suas abas
const GID_LANCHONETE = '0';
const GID_RESTAURANTE = '558634459';

// --- Funções de Leitura e Tratamento de Dados da Planilha ---

// Função auxiliar para buscar dados CSV de uma aba específica e converter para JSON
async function fetchCsvData(gid) {
    // Constrói a URL completa para a aba específica no formato CSV
    const url = `${BASE_URL_PLANILHA}&gid=${gid}`;

    try {
        const response = await fetch(url);
        // Verifica se a resposta foi bem-sucedida (status 200)
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - Não foi possível carregar os dados da planilha. Verifique as permissões de publicação.`);
        }
        const csvText = await response.text();
        return csvToJson(csvText);
    } catch (error) {
        console.error('Erro ao buscar dados da planilha:', error);
        // Retorna um array vazio para evitar erros no resto do script
        return [];
    }
}

// Função para converter texto CSV para um array de objetos JSON
function csvToJson(csv) {
    const lines = csv.split('\n');
    // Remove linhas vazias no final do CSV (comuns em exportações)
    const filteredLines = lines.filter(line => line.trim() !== '');

    if (filteredLines.length === 0) return [];

    const headers = filteredLines[0].split(',').map(header => header.trim());
    const result = [];

    for (let i = 1; i < filteredLines.length; i++) {
        const obj = {};
        const currentline = filteredLines[i].split(',');

        // Garante que a linha tenha o mesmo número de colunas que o cabeçalho
        if (currentline.length === headers.length) {
            for (let j = 0; j < headers.length; j++) {
                // Remove espaços em branco extras dos valores
                obj[headers[j]] = currentline[j].trim();
            }
            result.push(obj);
        } else {
            console.warn(`Linha ${i + 1} ignorada devido a número inconsistente de colunas: "${filteredLines[i]}"`);
        }
    }
    return result;
}

let dadosLanchonete = [];
let dadosRestaurante = {}; // Objeto para armazenar pratos do restaurante organizados por dia

// Carrega os dados da planilha assim que a página é carregada
document.addEventListener('DOMContentLoaded', async () => {
    dadosLanchonete = await fetchCsvData(GID_LANCHONETE);
    const restauranteCsv = await fetchCsvData(GID_RESTAURANTE);

    // Organiza os dados do restaurante por dia da semana para facilitar o acesso
    restauranteCsv.forEach(item => {
        // Converte o nome do dia para minúsculas para padronização (ex: 'Segunda' -> 'segunda')
        const dia = item.Dia ? item.Dia.toLowerCase() : 'semdia'; // Adiciona fallback para 'semdia'

        if (!dadosRestaurante[dia]) {
            // Se o dia ainda não existe no objeto, cria a estrutura
            dadosRestaurante[dia] = {
                // Capitaliza a primeira letra do dia para o título (ex: 'segunda' -> 'Segunda')
                titulo: `Cardápio de ${item.Dia ? item.Dia.charAt(0).toUpperCase() + item.Dia.slice(1) : 'Dia Indefinido'}`,
                pratos: []
            };
        }
        // Adiciona o prato à lista do dia correspondente
        dadosRestaurante[dia].pratos.push({
            Nome: item.Nome,      // Usando 'Nome' conforme a planilha
            Preco: item.Preco,    // Usando 'Preco' conforme a planilha
            Descricao: item.Descricao || '' // Adiciona Descricao, com fallback para vazio se não existir
        });
    });

    console.log("Dados da Lanchonete carregados:", dadosLanchonete);
    console.log("Dados do Restaurante carregados:", dadosRestaurante);
});

// --- Funções de Exibição do Cardápio ---

function mostrarLanchonete() {
    document.getElementById('inicio').style.display = 'none';
    const lanchoneteLista = document.getElementById('lanchonete-lista');
    lanchoneteLista.innerHTML = ''; // Limpa a lista antes de adicionar os itens

    if (dadosLanchonete.length === 0) {
        lanchoneteLista.innerHTML = '<li>Nenhum item disponível na lanchonete.</li>';
    } else {
        dadosLanchonete.forEach(item => {
            const descricaoHtml = item.Descricao ? `<p>${item.Descricao}</p>` : '';
            lanchoneteLista.innerHTML += `
                <li>
                    <h3>${item.Nome}</h3>
                    ${descricaoHtml}
                    <strong>${item.Preco}</strong>
                </li>`;
        });
    }
    document.getElementById('lanchonete').style.display = 'flex';
}

function mostrarRestaurante() {
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('restaurante').style.display = 'flex';
}

function mostrarCardapio(dia) {
    document.getElementById('restaurante').style.display = 'none';
    const cardapioDiv = document.getElementById('cardapio');
    const data = dadosRestaurante[dia]; // Acessa os dados do dia específico

    if (!data || data.pratos.length === 0) {
        // Caso não haja dados para o dia ou o dia não exista
        cardapioDiv.innerHTML = `
            <h2>Cardápio de ${dia.charAt(0).toUpperCase() + dia.slice(1)}</h2>
            <ul><li>Nenhum prato disponível para este dia.</li></ul>
            <button class="voltar" onclick="voltarRestaurante()">⬅ Voltar</button>`;
    } else {
        // Renderiza os pratos do dia
        cardapioDiv.innerHTML = `
            <h2>${data.titulo}</h2>
            <ul>
                ${data.pratos.map(prato => {
                    const descricaoHtml = prato.Descricao ? `<p>${prato.Descricao}</p>` : '';
                    return `
                        <li>
                            <h3>${prato.Nome}</h3>
                            ${descricaoHtml}
                            <strong>${prato.Preco}</strong>
                        </li>`;
                }).join("")}
            </ul>
            <button class="voltar" onclick="voltarRestaurante()">⬅ Voltar</button>`;
    }
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
