import readline from 'readline-sync';
import salarioMinimo from "./salario_minimo.js"
import inflacao from "./inflacao.js"

console.log("Escolha uma das opções abaixo:\n");
console.log("1 - Listar o salário mínimo de 2010 até 2026");
console.log("2 - Listar o índice IPCA de 2010 até 2026");
console.log("3 - Comparação entre o salário mínimo e o IPCA de 2010 até 2026\n");

let escolha = Number(readline.question("Digite o numero da sua escolha: "));

switch (escolha) {
  case 1:
    console.log("\n--- Histórico do Salário Mínimo ---");
    for (let item of salarioMinimo) {
      // Requisito: Dados em variáveis
      let ano = item.ano;
      let salario = item.salario;

      // Formatação para o padrão brasileiro: R$ 510,00
      let salarioFormatado = "R$ " + salario.toFixed(2).replace(".", ",");

      let labelAno = "Ano:".padEnd(30, ".");
      let labelSalario = "Salário Mínimo:".padEnd(30, ".");

      console.log(`${labelAno} ${ano}`);
      console.log(`${labelSalario} ${salarioFormatado}\n`);
    }
    break;

  case 2:
    console.log("\n--- Histórico da Inflação IPCA ---");
    for (let item of inflacao) {
      let ano = item.ano;
      let ipca = item.ipca;

      let labelAno = "Ano:".padEnd(30, ".");
      let labelIpca = "Inflação IPCA:".padEnd(30, ".");

      let ipcaFormatado = ipca.toFixed(2).replace(".", ",") + "%";

      console.log(`${labelAno} ${ano}`);
      console.log(`${labelIpca} ${ipcaFormatado}\n`);
    }
    break;

  case 3:
    console.log("\n--- Comparativo entre Salário Mínimo e IPCA ---");
    for (let i = 0; i < salarioMinimo.length; i++) {
      let ano = salarioMinimo[i].ano;
      let salario = salarioMinimo[i].salario;
      let ipca = inflacao[i].ipca;

      let percentualCrescimento;
      let crescimentoFormatado;

      if (i > 0) {
        let salarioAnterior = salarioMinimo[i - 1].salario;
        let diferenca = salario - salarioAnterior;
        percentualCrescimento = (diferenca / salarioAnterior) * 100;
        crescimentoFormatado = percentualCrescimento.toFixed(2).replace(".", ",") + "%";
      } else {
        crescimentoFormatado = "-";
      }

      let salarioFormatado = "R$ " + salario.toFixed(2).replace(".", ",");
      let ipcaFormatado = ipca.toFixed(2).replace(".", ",") + "%";

      let labelAno = "Ano:".padEnd(30, ".");
      let labelSalario = "Salário Mínimo:".padEnd(30, ".");
      let labelCrescimento = "Crescimento Salarial:".padEnd(30, ".");
      let labelIpca = "Inflação IPCA:".padEnd(30, ".");

      console.log(`${labelAno} ${ano}`);
      console.log(`${labelSalario} ${salarioFormatado}`);
      console.log(`${labelCrescimento} ${crescimentoFormatado}`);
      console.log(`${labelIpca} ${ipcaFormatado}\n`);
    }
    break;

  default:
    console.log("Opção inválida.");
}


