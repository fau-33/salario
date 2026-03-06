import salarioMinimo from './salario_minimo.js';
import inflacao from './inflacao.js';

let chartInstance = null;

const state = {
  currentView: 'salario', // 'salario', 'inflacao', 'comparativo'
};

// Selectors
const viewTitle = document.getElementById('view-title');
const viewDescription = document.getElementById('view-description');
const tableHeadRow = document.getElementById('table-head-row');
const tableBody = document.getElementById('table-body');
const navButtons = document.querySelectorAll('.nav-item');

// Formatting
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const formatPercent = (val) => val.toFixed(2).replace('.', ',') + '%';

// Logic: Update Dashboard UI
function updateUI() {
  // Clear elements
  tableHeadRow.innerHTML = '';
  tableBody.innerHTML = '';

  if (state.currentView === 'salario') {
    renderSalarioView();
  } else if (state.currentView === 'inflacao') {
    renderInflacaoView();
  } else if (state.currentView === 'comparativo') {
    renderComparativoView();
  }
}

function renderSalarioView() {
  viewTitle.textContent = 'Histórico do Salário Mínimo';
  viewDescription.textContent = 'Evolução salarial de 2010 a 2026';

  tableHeadRow.innerHTML = `
        <th>Ano</th>
        <th>Salário Mínimo</th>
    `;

  salarioMinimo.forEach(item => {
    const row = `
            <tr>
                <td>${item.ano}</td>
                <td><strong>${formatCurrency(item.salario)}</strong></td>
            </tr>
        `;
    tableBody.insertAdjacentHTML('beforeend', row);
  });

  renderChart(
    salarioMinimo.map(i => i.ano),
    salarioMinimo.map(i => i.salario),
    'Salário Mínimo (R$)',
    'rgba(99, 102, 241, 1)'
  );
}

function renderInflacaoView() {
  viewTitle.textContent = 'Histórico da Inflação';
  viewDescription.textContent = 'Índice de Preços ao Consumidor Amplo (IPCA)';

  tableHeadRow.innerHTML = `
        <th>Ano</th>
        <th>Taxa IPCA</th>
    `;

  inflacao.forEach(item => {
    const row = `
            <tr>
                <td>${item.ano}</td>
                <td class="badge-inflation">${formatPercent(item.ipca)}</td>
            </tr>
        `;
    tableBody.insertAdjacentHTML('beforeend', row);
  });

  renderChart(
    inflacao.map(i => i.ano),
    inflacao.map(i => i.ipca),
    'Inflação IPCA (%)',
    'rgba(244, 63, 94, 1)'
  );
}

function renderComparativoView() {
  viewTitle.textContent = 'Análise Comparativa';
  viewDescription.textContent = 'Evolução Salarial vs Inflação IPCA';

  tableHeadRow.innerHTML = `
        <th>Ano</th>
        <th>Salário</th>
        <th>Crescimento</th>
        <th>Inflação</th>
    `;

  for (let i = 0; i < salarioMinimo.length; i++) {
    const itemS = salarioMinimo[i];
    const itemI = inflacao[i];

    let growthStr = '-';
    if (i > 0) {
      const diff = itemS.salario - salarioMinimo[i - 1].salario;
      const perc = (diff / salarioMinimo[i - 1].salario) * 100;
      growthStr = formatPercent(perc);
    }

    const row = `
            <tr>
                <td>${itemS.ano}</td>
                <td>${formatCurrency(itemS.salario)}</td>
                <td class="badge-growth">${growthStr}</td>
                <td class="badge-inflation">${formatPercent(itemI.ipca)}</td>
            </tr>
        `;
    tableBody.insertAdjacentHTML('beforeend', row);
  }

  renderMultiChart();
}

// Global Chart Function
function renderChart(labels, data, label, color) {
  const ctx = document.getElementById('mainChart').getContext('2d');

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: color,
        backgroundColor: color.replace('1)', '0.1)'),
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8' } }
      },
      scales: {
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
      }
    }
  });
}

function renderMultiChart() {
  const ctx = document.getElementById('mainChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: salarioMinimo.map(i => i.ano),
      datasets: [
        {
          label: 'Salário (Eixo Esq)',
          data: salarioMinimo.map(i => i.salario),
          borderColor: '#6366f1',
          yAxisID: 'y'
        },
        {
          label: 'IPCA % (Eixo Dir)',
          data: inflacao.map(i => i.ipca),
          borderColor: '#f43f5e',
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { type: 'linear', display: true, position: 'left', grid: { color: 'rgba(255,255,255,0.05)' } },
        y1: { type: 'linear', display: true, position: 'right', grid: { display: false } }
      },
      plugins: {
        legend: { labels: { color: '#94a3b8' } }
      }
    }
  });
}

// Event Listeners
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.currentView = btn.dataset.view;
    updateUI();
  });
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  lucide.createIcons(); // Refresh icons after domestic renders
});
