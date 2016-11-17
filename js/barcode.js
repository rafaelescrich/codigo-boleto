var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

var transformTo47 = function(barcode) {
  var field1 = barcode.substr(0,4) + barcode.substr(19,1) + '.' + barcode.substr(20,4);
  var field2 = barcode.substr(24,5) + '.' + barcode.substr(24 + 5,5);
  var field3 = barcode.substr(34,5) + '.' + barcode.substr(34 + 5,5);
  var field4 = barcode.substr(4,1);   // Digito verificador
  var field5 = barcode.substr(5,14);  // Vencimento + Valor

  if (module11(barcode.substr(0,4) + barcode.substr(5,99)) != field4)
    alert('Digito verificador ' + field4 + ', o correto é ' + module11(barcode.substr(0,4)
          +linha.substr(5,99)) + '\nO sistema não altera automaticamente o dígito correto na quinta casa!');

  if (field5 == 0) field5 = '000';

  return field1 + module10(field1) + ' ' + field2 + module10(field2) + ' ' + field3 + module10(field3) + ' ' + field4 + ' ' + field5;
}

var transformTo44 = function(digitableLine) {
  if (digitableLine.length < 47 )
    digitableLine = digitableLine + '00000000000'
    .substr(0,47 - digitableLine.length);
  if (linha.length != 47)
    alert ('A linha do código de barras está incompleta!'
            + digitableLine.length);

  var code44  = digitableLine.substr(0,4) + digitableLine.substr(32,15)
            + digitableLine.substr(4,5) + digitableLine.substr(10,10)
            + digitableLine.substr(21,10);

  if (module11(digitableLine.substr(0,4) + digitableLine.substr(5,39)) != digitableLine.substr(4,1))
    alert('Digito verificador '+ digitableLine.substr(4,1) + ', o correto é '
           + module11_banco(digitableLine.substr(0,4)
           + digitableLine.substr(5,39))
           + '\nO sistema não altera automaticamente o dígito correto na quinta casa!');

  return code44;
}

var module10 = function(number) {
  var sum  = 0;
  var weight  = 2;
  var counter = number.length-1;

  while (counter >= 0) {
    multiplicacao = ( number.substr(counter,1) * weight );
    if (multiplication >= 10) {multiplication = 1 + (multiplication-10);}
    sum = sum + multiplication;
    if (weight == 2) {
      weight = 1;
    } else {
      weight = 2;
    }
    counter = counter - 1;
  }
  var digit = 10 - (sum % 10);
  if (digit == 10) digit = 0;
  return digit;
}

var module11 = function(number) {
  var sum  = 0;
  var weight  = 2;
  var base  = 9;
  var rest = 0;
  var counter = number.length - 1;

  for (var i=counter; i >= 0; i--) {
    sum = sum + ( number.substring(i,i+1) * weight);
    if (weight < base) {
      weight++;
    } else {
      weight = 2;
    }
  }
  var digit = 11 - (sum % 11);
  if (digit >  9) digit = 0;
  /* Utilizar o dígito 1(um) sempre que o resultado do cálculo
  padrão for igual a 0(zero), 1(um) ou 10(dez). */
  if (digit == 0) digit = 1;
  return digit;
}

var getJSONBanks = function () {
    return getJSON('banks.json');
}

var getBankName = function(digitableLine) {
  var codigo_banco = digitableLine.substr(0, 3);
  var bank_name;
  var jsonBanks = {};
  getJSONBanks().then(data) {
        jsonBanks = data;
    }, function(error) {
        return error;
  }
  for (var i = 0; i < jsonBanks.length; i++){
    var obj = jsonBanks[i];
    if(obj.codigo === codigo_banco)
        bank_name = obj.nome_banco;
  }
  if(bank_name === "undefined")
    return "Banco não existe";
  return bank_name;
}

var getDueDate = function(dueFactor) {
  var baseDate = new Date("October 07, 1997 15:00:00");
  baseDate = baseDate.getTime();
  var due = new Date();
  due.setTime(baseDate + (dueFactor * 24 * 60 * 60 * 1000));
  var dueDate = due.getDate();
  var dueMonth = due.getMonth();
  var dueYear = due.getFullYear();
  return ("0" + (dueDate)).slice(-2) + '/' + ("0" + (dueMonth + 1)).slice(-2) + '/' + dueYear;
}

var getValue = function(value) {
  var cents = parseInt(value.substr(value.length - 2, value.length));
  var characteristic = parseInt(value.substr(value.length - 10, value.length - 2));
  return characteristic + "," + cents;
}

var getCurrency = function(digitableLine) {
  var numCurrency = digitableLine.charAt(3);
  if(numCurrency !== '9')
    return "Boleto em outra moeda";
  else
    return "Real";
}
