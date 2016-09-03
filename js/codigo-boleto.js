// 0859468160000028251010611002155540000341701 - lido pelo leitor
// 08590106131002155540300034517011468160000028251 - linha digitavel
function verificaBoleto() {

  var linha_digitavel = document.getElementById('inputBoleto').value;

  // Posição 01-03 = identificação do banco (001 = Banco do Brasil)
  var banco = parseInt(linha_digitavel.substr(0, 3));
  var nome_banco;
  for (var i = 0; i < bancos.length; i++){
    var obj = bancos[i];
    if(obj.codigo === banco)
        nome_banco = obj.nome_do_banco;
  }
  if(nome_banco === "undefined")
    alert("Banco não existe");
  document.getElementById('nome_banco').innerHTML = nome_banco;

  // Posição 04-04 = código da moeda (9 = Real)
  var moeda = linha_digitavel.charAt(3);
  var nome_moeda;
  if(moeda !== '9')
    alert('Boleto em outra moeda');
  else
    nome_moeda = "Real";
  document.getElementById('nome_moeda').innerHTML = nome_moeda;


  // Posição 05-09 = 5 primeiras posições do campo livre
  var primeiro_campo_livre = linha_digitavel.substr(4, 8);  

  // Posição 10-10 = dígito verificador do primeiro campo
  var dv_1_campo_livre = linha_digitavel.substr(9, 9);  

  // Posição 11-20 = 6ª a 15ª posições do campo livre
  var segundo_campo_livre = linha_digitavel.substr(10, 19);

  // Posição 21-21 = dígito verificador do segundo campo
  var dv_2_campo_livre = linha_digitavel.substr(20, 20);

  // Posição 22-31 = 16ª a 25ª posições do campo livre
  var terceiro_campo_livre = linha_digitavel.substr(21, 30);  

  // Posição 32-32 = dígito verificador do terceiro campo
  var dv_3_campo_livre = linha_digitavel.substr(31, 31);

  // Posição 33-33 = dígito verificador geral
  var dv_geral = linha_digitavel.substr(32, 32);

  // Posição 34-37 = fator de vencimento (3737 = 31/12/2007)
  var fator_vencimento = linha_digitavel.substr(33, 36);
  var data_base = new Date('10/07/1997');
  var vencimento = data_base.getTime() + (fator_vencimento * 24 * 60 * 60 * 1000);
  var data_vencimento = ("0" + (vencimento.getDate())).slice(-2) + '/' 
                      + ("0" + (vencimento.getMonth() + 1)).slice(-2) 
                      + '/' + vencimento.getFullYear();
  document.getElementById('data_vencimento').innerHTML = data_vencimento;

  // Posição 38-47 = valor do boleto (100 = R$1,00)
  var valor = linha_digitavel.substr(37, 46);
  var centavos = valor.substr(valor.length, valor.length - 1);
  var inteiros = valor.substr(valor.length - 2, valor.length - 10);
  var valor_boleto = "R$ " + inteiros + "," + centavos;
  document.getElementById('valor_boleto').innerHTML = valor_boleto;


  // document.getElementById('inputBoletoVerificado').innerHTML = calcula_linha(numBoleto);

}

function calcula_linha(barra) {
  
  linha = barra.replace(/[^0-9]/g,'');
  
  if (modulo10('399903512') != 8)
    alert('Função "módulo 10" está com erro!');
  
  if (linha.length != 44)
    alert ('A linha do código de barras está incompleta!');
  
  var campo1 = linha.substr(0,4)+linha.substr(19,1)+'.'+linha.substr(20,4);
  var campo2 = linha.substr(24,5)+'.'+linha.substr(24+5,5);
  var campo3 = linha.substr(34,5)+'.'+linha.substr(34+5,5);
  var campo4 = linha.substr(4,1);   // Digito verificador
  var campo5 = linha.substr(5,14);  // Vencimento + Valor
  
  if (  modulo11_banco(  linha.substr(0,4)+linha.substr(5,99)  ) != campo4 )
    alert('Digito verificador '+campo4+', o correto é '
            +modulo11_banco(  linha.substr(0,4)+linha.substr(5,99)  )
            +'\nO sistema não altera automaticamente o dígito correto na quinta casa!');
  
  if (campo5 == 0) campo5 = '000';
  linha =  campo1 + modulo10(campo1)
      +' '
      +campo2 + modulo10(campo2)
      +' '
      +campo3 + modulo10(campo3)
      +' '
      +campo4
      +' '
      +campo5
      ;
  console.log(linha);
  return(linha);
}

function modulo10(numero) {
  
  numero = numero.replace(/[^0-9]/g,'');
  
  var soma  = 0;
  var peso  = 2;
  var contador = numero.length-1;
  
  while (contador >= 0) {
    multiplicacao = ( numero.substr(contador,1) * peso );
    if (multiplicacao >= 10) {multiplicacao = 1 + (multiplicacao-10);}
    soma = soma + multiplicacao;
    if (peso == 2) {
      peso = 1;
    } else {
      peso = 2;
    }
    contador = contador - 1;
  }
  
  var digito = 10 - (soma % 10);
  if (digito == 10)
    digito = 0;
  
  return digito;
}

function modulo11_banco(numero) {
  
  numero = numero.replace(/[^0-9]/g,'');
  
  var soma  = 0;
  var peso  = 2;
  var base  = 9;
  var resto = 0;
  var contador = numero.length - 1;
  
  for (var i=contador; i >= 0; i--) {
    soma = soma + ( numero.substring(i,i+1) * peso);
    if (peso < base) {
      peso++;
    } else {
      peso = 2;
    }
  }
  var digito = 11 - (soma % 11);
  
  if (digito >  9)
    digito = 0;
  if (digito == 0)
    digito = 1;
  
  return digito;
}

var bancos = [
  {
    "codigo": "0",
    "nome_banco": "Banco Bankpar S.A."
  },
  {
    "codigo": 1,
    "nome_banco": "Banco do Brasil S.A."
  },
  {
    "codigo": 3,
    "nome_banco": "Banco da Amazônia S.A."
  },
  {
    "codigo": 4,
    "nome_banco": "Banco do Nordeste do Brasil S.A."
  },
  {
    "codigo": 12,
    "nome_banco": "Banco Standard de Investimentos S.A."
  },
  {
    "codigo": 14,
    "nome_banco": "Natixis Brasil S.A. Banco Múltiplo"
  },
  {
    "codigo": 19,
    "nome_banco": "Banco Azteca do Brasil S.A."
  },
  {
    "codigo": 21,
    "nome_banco": "BANESTES S.A. Banco do Estado do Espírito Santo"
  },
  {
    "codigo": 24,
    "nome_banco": "Banco de Pernambuco S.A. - BANDEPE"
  },
  {
    "codigo": 25,
    "nome_banco": "Banco Alfa S.A."
  },
  {
    "codigo": 29,
    "nome_banco": "Banco Banerj S.A."
  },
  {
    "codigo": 31,
    "nome_banco": "Banco Beg S.A."
  },
  {
    "codigo": 33,
    "nome_banco": "Banco Santander (Brasil) S.A."
  },
  {
    "codigo": 36,
    "nome_banco": "Banco Bradesco BBI S.A."
  },
  {
    "codigo": 37,
    "nome_banco": "Banco do Estado do Pará S.A."
  },
  {
    "codigo": 39,
    "nome_banco": "Banco do Estado do Piauí S.A. - BEP"
  },
  {
    "codigo": 40,
    "nome_banco": "Banco Cargill S.A."
  },
  {
    "codigo": 41,
    "nome_banco": "Banco do Estado do Rio Grande do Sul S.A."
  },
  {
    "codigo": 44,
    "nome_banco": "Banco BVA S.A."
  },
  {
    "codigo": 45,
    "nome_banco": "Banco Opportunity S.A."
  },
  {
    "codigo": 47,
    "nome_banco": "Banco do Estado de Sergipe S.A."
  },
  {
    "codigo": 62,
    "nome_banco": "Hipercard Banco Múltiplo S.A."
  },
  {
    "codigo": 63,
    "nome_banco": "Banco Ibi S.A. Banco Múltiplo"
  },
  {
    "codigo": 64,
    "nome_banco": "Goldman Sachs do Brasil Banco Múltiplo S.A."
  },
  {
    "codigo": 65,
    "nome_banco": "Banco Bracce S.A."
  },
  {
    "codigo": 66,
    "nome_banco": "Banco Morgan Stanley S.A."
  },
  {
    "codigo": 69,
    "nome_banco": "BPN Brasil Banco Múltiplo S.A."
  },
  {
    "codigo": 70,
    "nome_banco": "BRB - Banco de Brasília S.A."
  },
  {
    "codigo": 72,
    "nome_banco": "Banco Rural Mais S.A."
  },
  {
    "codigo": 73,
    "nome_banco": "BB Banco Popular do Brasil S.A."
  },
  {
    "codigo": 74,
    "nome_banco": "Banco J. Safra S.A."
  },
  {
    "codigo": 75,
    "nome_banco": "Banco CR2 S.A."
  },
  {
    "codigo": 76,
    "nome_banco": "Banco KDB S.A."
  },
  {
    "codigo": 78,
    "nome_banco": "BES Investimento do Brasil S.A.-Banco de Investimento"
  },
  {
    "codigo": 79,
    "nome_banco": "JBS Banco S.A."
  },
  {
    "codigo": 84,
    "nome_banco": "Unicred Norte do Paraná"
  },
  {
    "codigo": 96,
    "nome_banco": "Banco BM&F de Serviços de Liquidação e Custódia S.A"
  },
  {
    "codigo": 104,
    "nome_banco": "Caixa Econômica Federal"
  },
  {
    "codigo": 107,
    "nome_banco": "Banco BBM S.A."
  },
  {
    "codigo": 168,
    "nome_banco": "HSBC Finance (Brasil) S.A. - Banco Múltiplo"
  },
  {
    "codigo": 184,
    "nome_banco": "Banco Itaú BBA S.A."
  },
  {
    "codigo": 204,
    "nome_banco": "Banco Bradesco Cartões S.A."
  },
  {
    "codigo": 208,
    "nome_banco": "Banco BTG Pactual S.A."
  },
  {
    "codigo": 212,
    "nome_banco": "Banco Matone S.A."
  },
  {
    "codigo": 213,
    "nome_banco": "Banco Arbi S.A."
  },
  {
    "codigo": 214,
    "nome_banco": "Banco Dibens S.A."
  },
  {
    "codigo": 215,
    "nome_banco": "Banco Comercial e de Investimento Sudameris S.A."
  },
  {
    "codigo": 217,
    "nome_banco": "Banco John Deere S.A."
  },
  {
    "codigo": 218,
    "nome_banco": "Banco Bonsucesso S.A."
  },
  {
    "codigo": 222,
    "nome_banco": "Banco Credit Agricole Brasil S.A."
  },
  {
    "codigo": 224,
    "nome_banco": "Banco Fibra S.A."
  },
  {
    "codigo": 225,
    "nome_banco": "Banco Brascan S.A."
  },
  {
    "codigo": 229,
    "nome_banco": "Banco Cruzeiro do Sul S.A."
  },
  {
    "codigo": 230,
    "nome_banco": "Unicard Banco Múltiplo S.A."
  },
  {
    "codigo": 233,
    "nome_banco": "Banco GE Capital S.A."
  },
  {
    "codigo": 237,
    "nome_banco": "Banco Bradesco S.A."
  },
  {
    "codigo": 241,
    "nome_banco": "Banco Clássico S.A."
  },
  {
    "codigo": 243,
    "nome_banco": "Banco Máxima S.A."
  },
  {
    "codigo": 246,
    "nome_banco": "Banco ABC Brasil S.A."
  },
  {
    "codigo": 248,
    "nome_banco": "Banco Boavista Interatlântico S.A."
  },
  {
    "codigo": 249,
    "nome_banco": "Banco Investcred Unibanco S.A."
  },
  {
    "codigo": 250,
    "nome_banco": "Banco Schahin S.A."
  },
  {
    "codigo": 254,
    "nome_banco": "Paraná Banco S.A."
  },
  {
    "codigo": 263,
    "nome_banco": "Banco Cacique S.A."
  },
  {
    "codigo": 265,
    "nome_banco": "Banco Fator S.A."
  },
  {
    "codigo": 266,
    "nome_banco": "Banco Cédula S.A."
  },
  {
    "codigo": 300,
    "nome_banco": "Banco de La Nacion Argentina"
  },
  {
    "codigo": 318,
    "nome_banco": "Banco BMG S.A."
  },
  {
    "codigo": 320,
    "nome_banco": "Banco Industrial e Comercial S.A."
  },
  {
    "codigo": 341,
    "nome_banco": "Itaú Unibanco S.A."
  },
  {
    "codigo": 356,
    "nome_banco": "Banco Real S.A."
  },
  {
    "codigo": 366,
    "nome_banco": "Banco Société Générale Brasil S.A."
  },
  {
    "codigo": 370,
    "nome_banco": "Banco WestLB do Brasil S.A."
  },
  {
    "codigo": 376,
    "nome_banco": "Banco J. P. Morgan S.A."
  },
  {
    "codigo": 389,
    "nome_banco": "Banco Mercantil do Brasil S.A."
  },
  {
    "codigo": 394,
    "nome_banco": "Banco Bradesco Financiamentos S.A."
  },
  {
    "codigo": 399,
    "nome_banco": "HSBC Bank Brasil S.A. - Banco Múltiplo"
  },
  {
    "codigo": 409,
    "nome_banco": "UNIBANCO - União de Bancos Brasileiros S.A."
  },
  {
    "codigo": 412,
    "nome_banco": "Banco Capital S.A."
  },
  {
    "codigo": 422,
    "nome_banco": "Banco Safra S.A."
  },
  {
    "codigo": 453,
    "nome_banco": "Banco Rural S.A."
  },
  {
    "codigo": 456,
    "nome_banco": "Banco de Tokyo-Mitsubishi UFJ Brasil S.A."
  },
  {
    "codigo": 464,
    "nome_banco": "Banco Sumitomo Mitsui Brasileiro S.A."
  },
  {
    "codigo": 473,
    "nome_banco": "Banco Caixa Geral - Brasil S.A."
  },
  {
    "codigo": 477,
    "nome_banco": "Citibank N.A."
  },
  {
    "codigo": 479,
    "nome_banco": "Banco ItaúBank S.A"
  },
  {
    "codigo": 487,
    "nome_banco": "Deutsche Bank S.A. - Banco Alemão"
  },
  {
    "codigo": 488,
    "nome_banco": "JPMorgan Chase Bank"
  },
  {
    "codigo": 492,
    "nome_banco": "ING Bank N.V."
  },
  {
    "codigo": 494,
    "nome_banco": "Banco de La Republica Oriental del Uruguay"
  },
  {
    "codigo": 495,
    "nome_banco": "Banco de La Provincia de Buenos Aires"
  },
  {
    "codigo": 505,
    "nome_banco": "Banco Credit Suisse (Brasil) S.A."
  },
  {
    "codigo": 600,
    "nome_banco": "Banco Luso Brasileiro S.A."
  },
  {
    "codigo": 604,
    "nome_banco": "Banco Industrial do Brasil S.A."
  },
  {
    "codigo": 610,
    "nome_banco": "Banco VR S.A."
  },
  {
    "codigo": 611,
    "nome_banco": "Banco Paulista S.A."
  },
  {
    "codigo": 612,
    "nome_banco": "Banco Guanabara S.A."
  },
  {
    "codigo": 613,
    "nome_banco": "Banco Pecúnia S.A."
  },
  {
    "codigo": 623,
    "nome_banco": "Banco Panamericano S.A."
  },
  {
    "codigo": 626,
    "nome_banco": "Banco Ficsa S.A."
  },
  {
    "codigo": 630,
    "nome_banco": "Banco Intercap S.A."
  },
  {
    "codigo": 633,
    "nome_banco": "Banco Rendimento S.A."
  },
  {
    "codigo": 634,
    "nome_banco": "Banco Triângulo S.A."
  },
  {
    "codigo": 637,
    "nome_banco": "Banco Sofisa S.A."
  },
  {
    "codigo": 638,
    "nome_banco": "Banco Prosper S.A."
  },
  {
    "codigo": 641,
    "nome_banco": "Banco Alvorada S.A."
  },
  {
    "codigo": 643,
    "nome_banco": "Banco Pine S.A."
  },
  {
    "codigo": 652,
    "nome_banco": "Itaú Unibanco Holding S.A."
  },
  {
    "codigo": 653,
    "nome_banco": "Banco Indusval S.A."
  },
  {
    "codigo": 654,
    "nome_banco": "Banco A.J.Renner S.A."
  },
  {
    "codigo": 655,
    "nome_banco": "Banco Votorantim S.A."
  },
  {
    "codigo": 707,
    "nome_banco": "Banco Daycoval S.A."
  },
  {
    "codigo": 719,
    "nome_banco": "Banif-Banco Internacional do Funchal (Brasil)S.A."
  },
  {
    "codigo": 721,
    "nome_banco": "Banco Credibel S.A."
  },
  {
    "codigo": 724,
    "nome_banco": "Banco Porto Seguro S.A."
  },
  {
    "codigo": 734,
    "nome_banco": "Banco Gerdau S.A."
  },
  {
    "codigo": 735,
    "nome_banco": "Banco Pottencial S.A."
  },
  {
    "codigo": 738,
    "nome_banco": "Banco Morada S.A."
  },
  {
    "codigo": 739,
    "nome_banco": "Banco BGN S.A."
  },
  {
    "codigo": 740,
    "nome_banco": "Banco Barclays S.A."
  },
  {
    "codigo": 741,
    "nome_banco": "Banco Ribeirão Preto S.A."
  },
  {
    "codigo": 743,
    "nome_banco": "Banco Semear S.A."
  },
  {
    "codigo": 744,
    "nome_banco": "BankBoston N.A."
  },
  {
    "codigo": 745,
    "nome_banco": "Banco Citibank S.A."
  },
  {
    "codigo": 746,
    "nome_banco": "Banco Modal S.A."
  },
  {
    "codigo": 747,
    "nome_banco": "Banco Rabobank International Brasil S.A."
  },
  {
    "codigo": 748,
    "nome_banco": "Banco Cooperativo Sicredi S.A."
  },
  {
    "codigo": 749,
    "nome_banco": "Banco Simples S.A."
  },
  {
    "codigo": 751,
    "nome_banco": "Dresdner Bank Brasil S.A. - Banco Múltiplo"
  },
  {
    "codigo": 752,
    "nome_banco": "Banco BNP Paribas Brasil S.A."
  },
  {
    "codigo": 753,
    "nome_banco": "NBC Bank Brasil S.A. - Banco Múltiplo"
  },
  {
    "codigo": 755,
    "nome_banco": "Bank of America Merrill Lynch Banco Múltiplo S.A."
  },
  {
    "codigo": 756,
    "nome_banco": "Banco Cooperativo do Brasil S.A. - BANCOOB"
  },
  {
    "codigo": 757,
    "nome_banco": "Banco KEB do Brasil S.A."
  },
  {
    "codigo": "077-9",
    "nome_banco": "Banco Intermedium S.A."
  },
  {
    "codigo": "081-7",
    "nome_banco": "Concórdia Banco S.A."
  },
  {
    "codigo": "082-5",
    "nome_banco": "Banco Topázio S.A."
  },
  {
    "codigo": "083-3",
    "nome_banco": "Banco da China Brasil S.A."
  },
  {
    "codigo": "085-x",
    "nome_banco": "Cooperativa Central de Crédito Urbano-CECRED"
  },
  {
    "codigo": "086-8",
    "nome_banco": "OBOE Crédito Financiamento e Investimento S.A."
  },
  {
    "codigo": "087-6",
    "nome_banco": "Cooperativa Unicred Central Santa Catarina"
  },
  {
    "codigo": "088-4",
    "nome_banco": "Banco Randon S.A."
  },
  {
    "codigo": "089-2",
    "nome_banco": "Cooperativa de Crédito Rural da Região de Mogiana"
  },
  {
    "codigo": "090-2",
    "nome_banco": "Cooperativa Central de Economia e Crédito Mutuo das Unicreds"
  },
  {
    "codigo": "091-4",
    "nome_banco": "Unicred Central do Rio Grande do Sul"
  },
  {
    "codigo": "092-2",
    "nome_banco": "Brickell S.A. Crédito, financiamento e Investimento"
  },
  {
    "codigo": "094-2",
    "nome_banco": "Banco Petra S.A."
  },
  {
    "codigo": "097-3",
    "nome_banco": "Cooperativa Central de Crédito Noroeste Brasileiro Ltda."
  },
  {
    "codigo": "098-1",
    "nome_banco": "Credicorol Cooperativa de Crédito Rural"
  },
  {
    "codigo": "099-x",
    "nome_banco": "Cooperativa Central de Economia e Credito Mutuo das Unicreds"
  },
  {
    "codigo": "M03",
    "nome_banco": "Banco Fiat S.A."
  },
  {
    "codigo": "M06",
    "nome_banco": "Banco de Lage Landen Brasil S.A."
  },
  {
    "codigo": "M07",
    "nome_banco": "Banco GMAC S.A."
  },
  {
    "codigo": "M08",
    "nome_banco": "Banco Citicard S.A."
  },
  {
    "codigo": "M09",
    "nome_banco": "Banco Itaucred Financiamentos S.A."
  },
  {
    "codigo": "M10",
    "nome_banco": "Banco Moneo S.A."
  },
  {
    "codigo": "M11",
    "nome_banco": "Banco IBM S.A."
  },
  {
    "codigo": "M12",
    "nome_banco": "Banco Maxinvest S.A."
  },
  {
    "codigo": "M13",
    "nome_banco": "Banco Tricury S.A."
  },
  {
    "codigo": "M14",
    "nome_banco": "Banco Volkswagen S.A."
  },
  {
    "codigo": "M15",
    "nome_banco": "Banco BRJ S.A."
  },
  {
    "codigo": "M16",
    "nome_banco": "Banco Rodobens S.A."
  },
  {
    "codigo": "M17",
    "nome_banco": "Banco Ourinvest S.A."
  },
  {
    "codigo": "M18",
    "nome_banco": "Banco Ford S.A."
  },
  {
    "codigo": "M19",
    "nome_banco": "Banco CNH Capital S.A."
  },
  {
    "codigo": "M20",
    "nome_banco": "Banco Toyota do Brasil S.A."
  },
  {
    "codigo": "M21",
    "nome_banco": "Banco Daimlerchrysler S.A."
  },
  {
    "codigo": "M22",
    "nome_banco": "Banco Honda S.A."
  },
  {
    "codigo": "M23",
    "nome_banco": "Banco Volvo (Brasil) S.A."
  },
  {
    "codigo": "M24",
    "nome_banco": "Banco PSA Finance Brasil S.A."
  }
];