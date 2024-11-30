import { Component, ChangeDetectorRef  } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/*

  Foi mal mais sou acostumado a programar em C++ <3 
  Tem que ser organizado, declarado e devidamente etiquetado =P

*/

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage 
{  
  private apiKey = '45c803b84ef93ed6a03b9cdb'; // Coloque sua chave API aqui
  private apiUrl = `https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/`;
  baseCurrency = 'USD'; // Moeda base, por exemplo, USD (Dólar)
  targetCurrency = 'BRL'; // Moeda alvo, por exemplo, BRL (Real)
  amount = 1; // Quantidade a ser convertida
  convertedMoney: any = {
    baseCurrency: '1', // Valor inicial para baseCurrency
    targetCurrency: '1', // Valor inicial para targetCurrency
  };
  convertedAmount: number = 0;

  ProgInMillis: string = ''; 
  convertedProg: any = this.convertProg(this.ProgInMillis);

  editableField: string = '';  // Usado para identificar qual campo está sendo editado
  timeInMillis: number = 1000; 
  convertedTime: any = this.convertTime(this.timeInMillis);
  tempCelsius: number = 1; 
  convertedTemp: any = this.convertTemp(this.tempCelsius);
  isHistoryVisible: boolean = true;
  currenthistory: string = '';
  currentInput: string = '';
  result: string = '';
  temp: string = '';
  memory = 0;
  selectedPage: string = 'Calculadora';

  navigate(page: string) {
    this.selectedPage = page;
  }
  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}
  toggleHistory() {
    this.isHistoryVisible = !this.isHistoryVisible;
  } // Mostra o Historico de calculos e esconde mostrando apenas o ultimo calculo registrado
  getLastLine(): string {
    // Verifica se o histórico está vazio
    if (!this.currenthistory) {
      return '';
    }

    // Divide o histórico em linhas considerando <br> como separador
    const lines = this.currenthistory.trim().split('<br>');

    // Retorna a última linha, removendo espaços em branco se necessário
    return lines[lines.length - 1].trim();
  } // Método ajustado para pegar a última linha do histórico considerando <br> como separador
  editField(field: string) {
    this.editableField = field; // Define qual campo será editado
  } // Função chamada ao clicar no botão Editar  

  ////
  // CONVERSOES PARA TEMPO
  ////
  convertTime(milliseconds: number) {
    const microseconds = milliseconds * 1000;
    const seconds = milliseconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const weeks = days / 7;
    const months = days / 30;  // Aproximadamente 30 dias por mês
    const years = days / 365;  // Aproximadamente 365 dias por ano

    return {
      microseconds: microseconds,
      milliseconds: milliseconds,
      seconds: seconds,
      minutes: minutes,
      hours: hours,
      days: days,
      weeks: weeks,
      months: months,
      years: years
    };
  } // Função que faz as conversões de tempo
  updateTime(unit: string) {
    switch (unit) {
      case 'microseconds':
        this.timeInMillis = this.convertedTime.microseconds / 1000;
        break;
      case 'milliseconds':
        this.timeInMillis = this.convertedTime.milliseconds;
        break;
      case 'seconds':
        this.timeInMillis = this.convertedTime.seconds * 1000;
        break;
      case 'minutes':
        this.timeInMillis = this.convertedTime.minutes * 60 * 1000;
        break;
      case 'hours':
        this.timeInMillis = this.convertedTime.hours * 60 * 60 * 1000;
        break;
      case 'days':
        this.timeInMillis = this.convertedTime.days * 24 * 60 * 60 * 1000;
        break;
      case 'weeks':
        this.timeInMillis = this.convertedTime.weeks * 7 * 24 * 60 * 60 * 1000;
        break;
      case 'months':
        this.timeInMillis = this.convertedTime.months * 30 * 24 * 60 * 60 * 1000;
        break;
      case 'years':
        this.timeInMillis = this.convertedTime.years * 365 * 24 * 60 * 60 * 1000;
        break;
    }
    
    // Atualizar as conversões após a mudança de qualquer campo
    this.convertedTime = this.convertTime(this.timeInMillis);
  } // Função chamada quando um campo de texto é alterado
  appendValue(value: any) {
    if (this.editableField) {
      // Garantir que o valor seja tratado como string antes de concatenar
      this.convertedTime[this.editableField] = (this.convertedTime[this.editableField] || '').toString() + value;
      this.updateTime(this.editableField);
    }
  } // Função para adicionar valores aos campos  
  clearInput() {
    if (this.editableField) {
      this.convertedTime[this.editableField] = '';
      this.updateTime(this.editableField);
    }
  } // Função para apagar o valor no campo atual  
  backspacetmp() {
    if (this.editableField && this.convertedTime[this.editableField]) {
      this.convertedTime[this.editableField] = this.convertedTime[this.editableField].slice(0, -1);
      this.updateTime(this.editableField);
    }
  } // Função para apagar um caractere no campo atual

  ////
  // CONVERSOES PARA TEMPERATURAS
  ////
  convertTemp(celsius: number) {
    const fahrenheit = (celsius * 9 / 5) + 32;
    const kelvin = celsius + 273.15;
  
    // Retorna os valores como strings sem formatação específica
    // Armazena como números para garantir que são floats
    return {
      celsius: celsius.toString(),
      fahrenheit: fahrenheit.toString(),
      kelvin: kelvin.toString(),
    };
  } // Função que faz as conversões de temperatura
  updateTemp(unit: string) {
    let tempValue = 0;
  
    // Verifique se o valor é válido antes de converter
    switch (unit) {
      case 'celsius':
        if (this.convertedTemp.celsius === '' || this.convertedTemp.celsius === '.') {
          return; // Evita conversão quando está vazio ou apenas um ponto
        }
        tempValue = parseFloat(this.convertedTemp.celsius);
        if (!isNaN(tempValue)) {
          this.tempCelsius = tempValue;
        }
        break;
      case 'fahrenheit':
        if (this.convertedTemp.fahrenheit === '' || this.convertedTemp.fahrenheit === '.') {
          return; // Evita conversão quando está vazio ou apenas um ponto
        }
        tempValue = parseFloat(this.convertedTemp.fahrenheit);
        if (!isNaN(tempValue)) {
          // Converte Fahrenheit para Celsius
          this.tempCelsius = (tempValue - 32) * 5 / 9;
        }
        break;
      case 'kelvin':
        if (this.convertedTemp.kelvin === '' || this.convertedTemp.kelvin === '.') {
          return; // Evita conversão quando está vazio ou apenas um ponto
        }
        tempValue = parseFloat(this.convertedTemp.kelvin);
        if (!isNaN(tempValue)) {
          // Converte Kelvin para Celsius
          this.tempCelsius = tempValue - 273.15;
        }
        break;
    }
  
    // Atualiza os campos após calcular os valores
    this.convertedTemp = this.convertTemp(this.tempCelsius);
  } // Função chamada quando um campo de texto é alterado
  appendValuetemp(value: any) {
    if (this.editableField) {
      let currentValue = this.convertedTemp[this.editableField] || '';
  
      // Verificação para evitar múltiplos pontos decimais
      if (value === '.' && currentValue.includes('.')) {
        return; // Não adiciona outro ponto se já existe um
      }
  
      // Adiciona o valor ao campo atual sem alterar o formato
      this.convertedTemp[this.editableField] = currentValue + value;
  
      // Atualiza a conversão após a alteração
      // Evita recalcular se o valor for apenas um ponto decimal
      if (value !== '.') {
        this.updateTemp(this.editableField);
      }
    }
  } // Função para adicionar valores aos campos
  clearInputt() {
    if (this.editableField) {
      this.convertedTemp[this.editableField] = '';  // Limpar o campo como string
      this.updateTemp(this.editableField);
    }
  } // Função para apagar o valor no campo atual
  backspacetemp() {
    if (this.editableField && this.convertedTemp[this.editableField]) {
      // Remove o último caractere do valor no campo
      const currentValue = this.convertedTemp[this.editableField];
      
      // Atualiza o campo removendo o último caractere
      this.convertedTemp[this.editableField] = currentValue.slice(0, -1);
  
      // Se o campo ficar vazio, atualizar para zero para evitar problemas de conversão
      if (this.convertedTemp[this.editableField] === '') {
        this.convertedTemp[this.editableField] = '0';
      }
  
      // Atualiza a conversão
      this.updateTemp(this.editableField);
    }
  } // Função para apagar um caractere no campo atual
  
  ////
  // CONVERSOES PARA MOEDA
  ////  
  updateAllFields() {
    if (this.editableField) {
      // Se o campo editado for baseCurrency, converta para targetCurrency
      if (this.editableField === 'baseCurrency') {
        const convertedValues = this.convertMoney(parseFloat(this.convertedMoney.baseCurrency), this.baseCurrency, this.targetCurrency);
        this.convertedMoney.targetCurrency = convertedValues.toCurrencyValue; // Atualiza targetCurrency com o valor convertido
        this.convertCurrency();  // Atualiza o valor de convertedAmount
      } 
      // Se o campo editado for targetCurrency, converta para baseCurrency
      else if (this.editableField === 'targetCurrency') {
        const convertedValues = this.convertMoney(parseFloat(this.convertedMoney.targetCurrency), this.targetCurrency, this.baseCurrency);
        this.convertedMoney.baseCurrency = convertedValues.toCurrencyValue; // Atualiza baseCurrency com o valor convertido
        this.convertCurrency();  // Atualiza o valor de convertedAmount
      }
    }
  } // Método para atualizar todos os campos após a edição
  convertCurrency() {
    const url = `${this.apiUrl}${this.baseCurrency}`;
    
    this.http.get(url).subscribe(
      (data: any) => {
        const rate = data.conversion_rates[this.targetCurrency];
        if (rate) {
          this.convertedAmount = this.amount * rate;
        } else {
          console.error('Taxa de conversão não encontrada para a moeda alvo');
        }
      },
      (error) => {
        console.error('Erro ao obter taxas de câmbio', error);
      }
    );
  } // Função que faz as conversões de Moeda
  updateMoney(unit: string) {
    let tempValue = 0;
  
    // Verifique qual campo está sendo editado e pegue o valor correto
    if (unit === 'baseCurrency' && this.convertedMoney.baseCurrency) {
      tempValue = parseFloat(this.convertedMoney.baseCurrency);
    } else if (unit === 'targetCurrency' && this.convertedMoney.targetCurrency) {
      tempValue = parseFloat(this.convertedMoney.targetCurrency);
    }
  
    // Atualiza a quantidade (amount) e converte entre as moedas se o valor for válido
    if (!isNaN(tempValue)) {
      this.amount = tempValue;
  
      // Converte o valor usando as moedas selecionadas
      const convertedValues = this.convertMoney(this.amount, this.baseCurrency, this.targetCurrency);
  
      // Atualiza os valores nos campos `ion-textarea`
      this.convertedMoney.baseCurrency = convertedValues.fromCurrencyValue;
      this.convertedMoney.targetCurrency = convertedValues.toCurrencyValue;
    }
  } // Função chamada quando um campo de texto é alterado
  convertMoney(amount: number, fromCurrency: string, toCurrency: string): any {
    const url = `${this.apiUrl}${fromCurrency}`;
  
    let convertedValues = {
      fromCurrencyValue: amount.toString(),
      toCurrencyValue: ''
    };
  
    this.http.get(url).subscribe(
      (data: any) => {
        const rate = data.conversion_rates[toCurrency];
        if (rate) {
          const convertedValue = amount * rate;
          this.convertedAmount = convertedValue;
          convertedValues.toCurrencyValue = convertedValue.toString();
          
          // Atualiza os valores diretamente
          if (fromCurrency === this.baseCurrency) {
            this.convertedMoney.targetCurrency = convertedValues.toCurrencyValue;
          } else if (fromCurrency === this.targetCurrency) {
            this.convertedMoney.baseCurrency = convertedValues.toCurrencyValue;
          }
  
          // Força a detecção de mudanças após a atualização
          this.cdRef.detectChanges();
        } else {
          console.error('Taxa de conversão não encontrada para a moeda alvo');
        }
      },
      (error) => {
        console.error('Erro ao obter taxas de câmbio', error);
      }
    );
  
    return convertedValues;
  } // Função que faz as conversões de Moedas
  appendValueMoney(value: any) {
    if (this.editableField) {
      let currentValue = this.convertedMoney[this.editableField] || '';
  
      // Evita adicionar mais de um ponto decimal
      if (value === '.' && currentValue.includes('.')) {
        return;
      }
  
      // Atualiza o valor no campo ativo
      this.convertedMoney[this.editableField] = currentValue + value;
  
      // Realiza a atualização de todos os campos após adicionar o valor
      this.updateAllFields();
    }
  } // Função para adicionar valores aos campos
  clearInputMoney() 
  {
    if (this.editableField) {
      this.convertedMoney[this.editableField] = ''; // Limpa o campo
      this.updateAllFields(); // Atualiza os campos após limpeza
    }
  } // Função para apagar o valor no campo atual
  backspaceMoney()
  {
    if (this.editableField && this.convertedMoney[this.editableField]) {
      const currentValue = this.convertedMoney[this.editableField];
      this.convertedMoney[this.editableField] = currentValue.slice(0, -1) || ''; // Remove o último caractere
      this.updateAllFields(); // Atualiza os campos após a remoção
    }
  }  // Método para remover o último caractere no campo ativo
  
  ////
  // CONVERSOES PARA VALORES BINARIO, HEXA, OCTAL, DECIMAL ETC
  //// 
  async hashFunction(data: string, algorithm: 'SHA-1' | 'SHA-256'): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  async convertProg(valor: string) {
    let decimal: number = parseInt(valor, 10);
  
    // Se for numérico, convertemos diretamente para binário, sem adicionar zeros extras
    let binaria: string;
    if (!isNaN(decimal)) {
      binaria = decimal.toString(2); // Converte diretamente sem padStart
    } else {
      // Se for string, convertemos caractere por caractere para binário
      binaria = valor.split('')
                     .map(c => c.charCodeAt(0).toString(2).padStart(8, '0')) // Cada caractere vira binário
                     .join(' ');
    }
  
    // A lógica para as outras conversões permanece
    const hexadecimal = isNaN(decimal) ? 
      valor.split('').map(c => c.charCodeAt(0).toString(16).toUpperCase()).join(' ') :
      decimal.toString(16).toUpperCase(); // Converte o número decimal para hexadecimal
  
    const octal = isNaN(decimal) ? 
      valor.split('').map(c => c.charCodeAt(0).toString(8)).join(' ') :
      decimal.toString(8); // Converte o número decimal para octal
  
    const base64 = btoa(valor); // Texto para Base64
    const ascii = valor.split('').map(char => char.charCodeAt(0)).join(' '); // String para ASCII
  
    return {
      valor: valor,
      binaria: binaria, // Binário ajustado
      hexadecimal: hexadecimal,
      octal: octal,
      decimal: valor, // Deixando como string, não convertendo para número
      base64: base64,
      ascii: ascii,
      hashsha1: await this.hashFunction(valor, 'SHA-1'), // Hash SHA1
      hashsha256: await this.hashFunction(valor, 'SHA-256'), // Hash SHA256
    };
  } // Função que faz as conversões de tempo
  async updateProg(unit: string) {
    let decimal: number;
  
    if (unit === 'valor') {
      const inputValue = this.convertedProg.valor.trim();
  
      // Tratamento do valor como string sem conversão para número
      if (!isNaN(Number(inputValue))) {
        decimal = Number(inputValue); // Isso lida com entradas que são números válidos
      } else {
        decimal = NaN; // Para valores não numéricos, mantém decimal como NaN
      }
  
      if (!isNaN(decimal)) {
        this.ProgInMillis = decimal.toString();
        this.convertedProg = await this.convertProg(this.ProgInMillis); // Aguarda async
      } else {
        // Quando o valor não for um número, apenas atualize os outros campos
        this.convertedProg = await this.convertProg(inputValue); // Converte a string diretamente
      }
    } else {
      // Lógica para conversões de outros campos
      switch (unit) {
        case 'binaria':
          decimal = parseInt(this.convertedProg.binaria, 2);
          break;
        case 'hexadecimal':
          decimal = parseInt(this.convertedProg.hexadecimal, 16);
          break;
        case 'octal':
          decimal = parseInt(this.convertedProg.octal, 8);
          break;
        case 'decimal':
          decimal = parseInt(this.convertedProg.decimal, 10);
          break;
        case 'base64':
          const decoded = atob(this.convertedProg.base64);
          decimal = parseInt(decoded, 10);
          break;
        default:
          return;
      }
  
      if (!isNaN(decimal)) {
        this.ProgInMillis = decimal.toString();
        Object.assign(this.convertedProg, await this.convertProg(this.ProgInMillis));
      }
    }
  } // Função chamada quando um campo de texto é alterado 
  
  ////
  // CONVERSOES PARA CALCULADORA CLASSICA
  ////
  appendToInputsimbol(value: string) 
  {
    if (this.result != '')
    {
      this.temp = this.currentInput + '=' + this.result
      this.historico(this.temp)
      this.currentInput = this.result
      this.result = '';//eval(this.currentInput);

      this.currentInput += value; // incrementador
    }
    else
    {
      this.currentInput += value;
    }    
  } // Adiciona o valor ao input para simbolos
  appendToInput(value: string) 
  {
    this.currentInput += value;
  } // Adiciona o valor ao input para simbolos
  historico(value: string)
  {
    this.currenthistory = this.currenthistory + '<br>' + value
  } // Adiciona valores de entrada para o Historico  
  clear() 
  {
    if (this.currentInput == '')
    {
      //this.temp = '';
      //this.historico(this.temp)
      this.currentInput = '';
      this.result = '';
    }
    else
    {
      if (this.currentInput != '' || this.result)
      {
        this.result = eval(this.currentInput)
        this.temp = this.currentInput + '=' + this.result//eval(this.currentInput)
        this.historico(this.temp)
        this.result = '';
        this.currentInput = '';
      }
      else
      {
        this.temp = this.currentInput + '=' + this.result//eval(this.currentInput)
        this.historico(this.temp)
        this.currentInput = '';
        this.result = '';
      }
    }
    
  } // Limpa o input atual
  backspace(): void 
  {
    if (this.result != '')
    {
      this.result = '';
      this.currentInput = this.currentInput.slice(0, -1); // apaga uma dígito
    }
    else
    {
      this.currentInput = this.currentInput.slice(0, -1); // apaga um dígito
    }
  } // Função para apagar o último dígito ⌫ (backspace)
  
  calculate() 
  {
    try
    {
      if (this.result != '')
      {
        this.temp = this.currentInput + '=' + this.result
        this.historico(this.temp)
        this.currentInput = this.result
        this.result = '';//eval(this.currentInput);
        if (this.result == this.currentInput)
        {
          this.result = '';
        }
        else
        {
          this.result = eval(this.currentInput); // traz o resultado
        }
      }
      else
      {
        if (this.result == this.currentInput)
        {
          this.result = '';
        }
        else
        {
          this.result = eval(this.currentInput); // traz o resultado
        }
      }      
    } 
    catch (error) 
    {
      this.result = 'Error';
    }
  } // Calcula o resultado da expressão, Adição, Subtração, Multiplicação, Divisão
  square(): void 
  {
    if (this.currentInput) 
    {
      const currentValue = parseFloat(this.currentInput);
      this.currentInput = Math.pow(currentValue, 2).toString();
    }
  } // Função para elevar ao quadrado (x²)  
  squareRoot(): void 
  {
    if (this.currentInput != '')
    {
      const value = parseFloat(this.currentInput);
      this.temp = this.currentInput + '=' + Math.sqrt(value).toString();
      this.historico(this.temp) //resgistra no historico
      this.currentInput = Math.sqrt(value).toString(); // grava na entrada para prossegir para um calculo a partir do resultado
    }
    else
    {
      const value = parseFloat(this.currentInput);
      this.currentInput = Math.sqrt(value).toString();
    }
  } // Raiz quadrada 
  inverse(): void 
  {
    if (this.currentInput && parseFloat(this.currentInput) !== 0) 
    {
      const currentValue = parseFloat(this.currentInput);
      this.currentInput = (1 / currentValue).toString();
    }
  } // Função para calcular o inverso 1/x
  toggleSign(): void {
    if (this.currentInput)
    {
      const currentValue = parseFloat(this.currentInput);
      this.currentInput = (currentValue * -1).toString();
    }
  } // Função para alterar o sinal ± (mais/menos)
  calculatePercentage(): void {
    if (this.currentInput) {
      try {
        // Extrai o último operador (+, -, *, /)
        const lastOperator = this.currentInput.match(/[\+\-\*\/]/);

        if (lastOperator) {
          // Divide a expressão com base no operador encontrado
          const parts = this.currentInput.split(lastOperator[0]);
          const baseValue = parseFloat(parts[0]);  // Primeiro número da expressão
          const percentageValue = parseFloat(parts[1]) / 100;  // Valor percentual (transformado em fração)
          let result: number;  // Variável para armazenar o resultado final

          // Aplica a operação correta com base no operador
          switch (lastOperator[0]) {
            case '+':
              result = baseValue + (baseValue * percentageValue);
              break;
            case '-':
              result = baseValue - (baseValue * percentageValue);
              break;
            case '*':
              result = baseValue * percentageValue;
              break;
            case '/':
              result = baseValue / percentageValue;
              break;
            default:
              result = baseValue; // Caso algo dê errado, apenas retorna o valor base
          }

          // Armazena o resultado em `temp` e atualiza o `currentInput`
          this.temp = result.toString();
          this.result = this.temp;
        }
      } catch (error) {
        this.temp = 'Error';  // Se algo falhar, mostra 'Error'
      }
    }
  }// Função para calcular a porcentagem


  memoryAdd() 
  {
    this.memory += parseFloat(this.result);
  } // Adiciona o número atual ao valor armazenado na memória   M+
  memorySubtract() 
  {
    this.memory -= parseFloat(this.result);
  } // Subtrai o número atual do valor armazenado na memória    M-
  memoryRecall() 
  {
    this.currentInput = this.memory.toString();
  } // Recupera o valor armazenado na memória.                  MR
  memoryClear() 
  {
    this.memory = 0;
  } // Limpa o valor armazenado na memória                      MC
  memoryStore() 
  {
    this.memory = parseFloat(this.result); // Armazena o valor atual na memória
  } // Armazena o número atual na memória                       MS
  

  convertLength(value: number, fromUnit: string, toUnit: string): number 
  {
    // Conversão de todas as unidades de comprimento para metros
    const toMeters = (val: number, unit: string): number => 
    {
      switch (unit) 
      {
        case 'meters':
          return val; // Já está em metros
        case 'kilometers':
          return val * 1000; // 1 km = 1000 metros
        case 'miles':
          return val * 1609.34; // 1 milha = 1609.34 metros
        default:
          throw new Error('Unidade de comprimento desconhecida para conversão para metros');
      }
    };

    // Conversão de metros para a unidade desejada
    const fromMeters = (val: number, unit: string): number => {
      switch (unit) 
      {
        case 'meters':
          return val; // Já está em metros
        case 'kilometers':
          return val / 1000; // 1 km = 1000 metros
        case 'miles':
          return val / 1609.34; // 1 milha = 1609.34 metros
        default:
          throw new Error('Unidade de comprimento desconhecida para conversão a partir de metros');
      }
    };

    // Primeiro converte a unidade inicial para metros
    const valueInMeters = toMeters(value, fromUnit);

    // Em seguida, converte metros para a unidade de destino
    return fromMeters(valueInMeters, toUnit);

    /*
    const lengthInKilometers = convertLength(1000, 'meters', 'kilometers');
    console.log(lengthInKilometers); // 1

    const lengthInMeters = convertLength(5, 'kilometers', 'meters');
    console.log(lengthInMeters); // 5000

    const lengthInMiles = convertLength(1609.34, 'meters', 'miles');
    console.log(lengthInMiles); // 1

    const lengthInKilometersFromMiles = convertLength(2, 'miles', 'kilometers');
    console.log(lengthInKilometersFromMiles); // 3.21868

    */
  } // Converte valores entre diferentes unidades de comprimento Metros, Kilometros, Milhas
  convertWeight(value: number, fromUnit: string, toUnit: string): number 
  {
    // Conversão de todas as unidades de peso para quilogramas
    const toKilograms = (val: number, unit: string): number => 
    {
      switch (unit) 
      {
        case 'kilograms':
          return val; // Já está em quilogramas
        case 'grams':
          return val / 1000; // 1 g = 0.001 kg
        case 'pounds':
          return val * 0.453592; // 1 lb = 0.453592 kg
        default:
          throw new Error('Unidade de peso desconhecida para conversão para quilogramas');
      }
    };

    // Conversão de quilogramas para a unidade desejada
    const fromKilograms = (val: number, unit: string): number => 
    {
      switch (unit) 
      {
        case 'kilograms':
          return val; // Já está em quilogramas
        case 'grams':
          return val * 1000; // 1 kg = 1000 g
        case 'pounds':
          return val / 0.453592; // 1 kg = 2.20462 lb
        default:
          throw new Error('Unidade de peso desconhecida para conversão a partir de quilogramas');
      }
    };

    // Primeiro converte a unidade inicial para quilogramas
    const valueInKilograms = toKilograms(value, fromUnit);

    // Em seguida, converte quilogramas para a unidade de destino
    return fromKilograms(valueInKilograms, toUnit);

    /*
    const weightInKilograms = convertWeight(1000, 'grams', 'kilograms');
    console.log(weightInKilograms); // 1

    const weightInGrams = convertWeight(5, 'kilograms', 'grams');
    console.log(weightInGrams); // 5000

    const weightInPounds = convertWeight(10, 'kilograms', 'pounds');
    console.log(weightInPounds); // 22.0462

    const weightInKilogramsFromPounds = convertWeight(150, 'pounds', 'kilograms');
    console.log(weightInKilogramsFromPounds); // 68.0389

    */
  } // Converte valores entre diferentes unidades de peso Gramas, Kilograma, Libras
  convertVolume(value: number, fromUnit: string, toUnit: string): number 
  {
    // Conversão de todas as unidades de volume para litros
    const toLiters = (val: number, unit: string): number => 
    {
      switch (unit) 
      {
        case 'liters':
          return val; // Já está em litros
        case 'milliliters':
          return val / 1000; // 1 mL = 0.001 litros
        case 'gallons':
          return val * 3.78541; // 1 galão = 3.78541 litros
        default:
          throw new Error('Unidade de volume desconhecida para conversão para litros');
      }
    };

    // Conversão de litros para a unidade desejada
    const fromLiters = (val: number, unit: string): number => 
    {
      switch (unit) 
      {
        case 'liters':
          return val; // Já está em litros
        case 'milliliters':
          return val * 1000; // 1 litro = 1000 mL
        case 'gallons':
          return val / 3.78541; // 1 galão = 3.78541 litros
        default:
          throw new Error('Unidade de volume desconhecida para conversão a partir de litros');
      }
    };

    // Primeiro converte a unidade inicial para litros
    const valueInLiters = toLiters(value, fromUnit);

    // Em seguida, converte litros para a unidade de destino
    return fromLiters(valueInLiters, toUnit);

    /*
    const volumeInLiters = convertVolume(500, 'milliliters', 'liters');
    console.log(volumeInLiters); // 0.5

    const volumeInMilliliters = convertVolume(2, 'liters', 'milliliters');
    console.log(volumeInMilliliters); // 2000

    const volumeInGallons = convertVolume(10, 'liters', 'gallons');
    console.log(volumeInGallons); // 2.64172

    const volumeInLitersFromGallons = convertVolume(5, 'gallons', 'liters');
    console.log(volumeInLitersFromGallons); // 18.92705

    */
  } // Converte valores entre diferentes unidades de volume Litros, mililitro, Galões
  convertArea(value: number, fromUnit: string, toUnit: string): number 
  {    
    const toSquareMeters = (val: number, unit: string): number => 
    {
      switch (unit) 
      {
        case 'squareMeters':
          return val; // Já está em metros quadrados
        case 'hectares':
          return val * 10000; // 1 hectare = 10.000 m²
        case 'acres':
          return val * 4046.86; // 1 acre = 4046,86 m²
        default:
          throw new Error('Unidade de área desconhecida para conversão para metros quadrados');
      }
    };

    // Conversão de metros quadrados para a unidade desejada
    const fromSquareMeters = (val: number, unit: string): number => 
    {
      switch (unit) 
      {
        case 'squareMeters':
          return val; // Já está em metros quadrados
        case 'hectares':
          return val / 10000; // 1 hectare = 10.000 m²
        case 'acres':
          return val / 4046.86; // 1 acre = 4046,86 m²
        default:
          throw new Error('Unidade de área desconhecida para conversão a partir de metros quadrados');
      }
    };

    // Primeiro converte a unidade inicial para metros quadrados
    const valueInSquareMeters = toSquareMeters(value, fromUnit);

    // Em seguida, converte metros quadrados para a unidade de destino
    return fromSquareMeters(valueInSquareMeters, toUnit);

    /*
    const areaInSquareMeters = convertArea(2, 'hectares', 'squareMeters');
    console.log(areaInSquareMeters); // 20000

    const areaInHectares = convertArea(5000, 'squareMeters', 'hectares');
    console.log(areaInHectares); // 0.5

    const areaInAcres = convertArea(10000, 'squareMeters', 'acres');
    console.log(areaInAcres); // 2.47105
    */
  }// Conversão de todas as unidades de Área metros quadrados, hectares, acres.

 
  power(): void 
  {
    const values = this.currentInput.split(' ').map(Number); // Extrai valores da entrada
    if (values.length === 2) 
    {
      const base: number = values[0];       // Atribui explicitamente o tipo
      const exponent: number = values[1];   // Atribui explicitamente o tipo
      this.currentInput = Math.pow(base, exponent).toString();
    }
    else
    {
      this.currentInput = 'Error'; // Mensagem de erro se a entrada não estiver correta
    }
  } // Potência (x^y)  
  sine(): void 
  {
    const value = parseFloat(this.currentInput);
    this.currentInput = Math.sin(value).toString();
  } // Cálculos de seno, cosseno e tangente
  cosine(): void 
  {
    const value = parseFloat(this.currentInput);
    this.currentInput = Math.cos(value).toString();
  } // Cosseno de um ângulo.
  tangent(): void 
  {
    const value = parseFloat(this.currentInput);
    this.currentInput = Math.tan(value).toString();
  } // Tangente de um ângulo.
  logarithm(): void 
  {
    const value = parseFloat(this.currentInput);
    this.currentInput = Math.log(value).toString();
  } // Logaritmo natural
}



