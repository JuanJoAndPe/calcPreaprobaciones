function actualizarMonto() {
    const valorVehiculo = parseFloat(document.getElementById('valor').value);
    const entrada = parseFloat(document.getElementById('entrada').value);
    const montoNum = valorVehiculo - entrada;
    document.getElementById('monto').value = montoNum.toFixed(2);
  }

document.getElementById('calcularBtn').addEventListener('click', function () {
     actualizarMonto();
    // Obtener los valores de los campos
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const valorVehiculo = parseFloat(document.getElementById('valor').value);
    const entrada = parseFloat(document.getElementById('entrada').value);
    const montoNum = valorVehiculo - entrada;
    const ingresoDeudor = parseFloat(document.getElementById('ingresoDeudor').value);
    const plazo = parseFloat(document.getElementById('plazo').value);
    const ingresoConyuge = parseFloat(document.getElementById('ingresoConyuge').value) || 0;
    const cedulaDeudor = document.getElementById('cedulaDeudor').value;
    const otrosIngresos = parseFloat(document.getElementById('otrosIngresos').value) || 0;
    const estadocivil = document.getElementById('estado_civil').value;
    const cedulaConyuge = document.getElementById('cedulaConyuge').value;
    const hijos = Math.trunc(parseFloat(document.getElementById('numerohijos').value)) || 0;
    const activos = parseFloat(document.getElementById('Activos').value) || 0;
    const separacionBienes = document.querySelector('input[name="separacion"]:checked')?.value;
    const terminosAceptados = document.getElementById('terminos').checked;
    const regexCedula = /^\d{10}$/;

    // Validar que todos los campos estén llenos
    function resetearEstilos(campos) {
      campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.border = '';
      });
    }

let errores = [];
const camposAValidar = ['valor', 'plazo', 'cedulaDeudor', 'estado_civil', 'ingresoDeudor', 'numerohijos', 'terminos'];
resetearEstilos(camposAValidar);

if (!valorVehiculo) {
    errores.push("El campo 'Valor Vehículo' es obligatorio.");
    document.getElementById('valor').style.border = '2px solid red';
}
if (!plazo) {
    errores.push("El campo 'Plazo' es obligatorio.");
    document.getElementById('plazo').style.border = '2px solid red';
}
if (!cedulaDeudor) {
    errores.push("El campo 'Cédula del Deudor' es obligatorio.");
    document.getElementById('cedulaDeudor').style.border = '2px solid red';
}
if (!estadocivil) {
    errores.push("El campo 'Estado Civil' es obligatorio.");
    document.getElementById('estado_civil').style.border = '2px solid red';
}
if ((estadocivil === "Casada/o" || estadocivil === "Unión Libre") && !separacionBienes) {
    errores.push("El campo 'Separación de Bienes' es obligatorio.");
}
if ((estadocivil === "Casada/o" || estadocivil === "Unión Libre") && !cedulaConyuge) {
    errores.push("El campo 'Cédula del Cónyuge' es obligatorio para el estado civil seleccionado.");
    document.getElementById('cedulaConyuge').style.border = '2px solid red';
}
if (!ingresoDeudor) {
    errores.push("El campo 'Ingreso del Deudor' es obligatorio.");
    document.getElementById('ingresoDeudor').style.border = '2px solid red';
}
if (document.getElementById('numerohijos').value === '') {
    errores.push("El campo 'Número de hijos' es obligatorio.");
    document.getElementById('numerohijos').style.border = '2px solid red';
}
if (!terminosAceptados) {
    errores.push("Debe aceptar los términos y condiciones para continuar.");
}
if (isNaN(montoNum) || montoNum <= 0) {
    errores.push("El campo 'Monto' no puede estar vacío y debe ser mayor que 0.");
}
if (!regexCedula.test(cedulaDeudor)) {
    errores.push("La cédula del deudor debe tener exactamente 10 dígitos.");
    document.getElementById('cedulaDeudor').style.border = '2px solid red';
}
if ((estadocivil === "Casada/o" || estadocivil === "Unión Libre") && !regexCedula.test(cedulaConyuge)) {
    errores.push("La cédula del cónyuge debe tener exactamente 10 dígitos.");
    document.getElementById('cedulaConyuge').style.border = '2px solid red';
}
if (ingresoDeudor <= 0) {
    errores.push("El ingreso del deudor no puede ser negativo y debe ser mayor que 0.");
    document.getElementById('ingresoDeudor').style.border = '2px solid red';
}
if (ingresoConyuge < 0) {
    errores.push("El ingreso del cónyuge no puede ser negativo.");
    document.getElementById('ingresoConyuge').style.border = '2px solid red';
}
if (otrosIngresos < 0) {
    errores.push("Los otros ingresos no pueden ser negativos.");
    document.getElementById('otrosIngresos').style.border = '2px solid red';
}
if (hijos < 0) {
    errores.push("Los hijos no pueden ser negativos.");
    document.getElementById('numerohijos').style.border = '2px solid red';
}

if (errores.length > 0) {
    window.alert("Corrige los siguientes errores:\n\n" + errores.join('\n'));
    return;
}

    //Variables usadas en API y posterior
    let identificacionSujeto;
    let nombreRazonSocial;
    let identificacionConyuge;
    let nombresConyuge;
    let score;
    let scoreConyuge;
    let ctaCorrientes;
    let ctaCorrientesConyuge;
    let deudaVigenteTotal;
    let cuotaTotal;
    let deudaVigenteConyuge = 0;
    let cuotaTotalConyuge = 0;
    let numOpActuales; 
    let mesesSinVencimientos;
    let carteraCastigada;
    let demandaJudicial;
    let numOpActualesConyuge;
    let mesesSinVencimientosConyuge;
    let carteraCastigadaConyuge;
    let demandaJudicialConyuge;


    // Crear un array de promesas para las solicitudes fetch
    const fetchPromises = [];

    //Función para llamar API
    fetchPromises.push(
        fetch('https://calcserver-3evg.onrender.com/proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
                     'Authorization': 'Bearer ' + localStorage.getItem('token')
           },
          body: JSON.stringify({
            "origin": "webservice",
            "request": {
              "codigoProducto": "T453",
              "datosEntrada": [
                {
                  "clave": "tipoIdentificacionSujeto",
                  "valor": "C"
                },
                {
                  "clave": "identificacionSujeto",
                  "valor": cedulaDeudor
                }
              ]
            }
          })
        })
      );
         
      // Si existe cédula del cónyuge, agregamos otra solicitud fetch para el cónyuge
      if (cedulaConyuge) {
        fetchPromises.push(
          fetch('https://calcserver-3evg.onrender.com/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                       'Authorization': 'Bearer ' + localStorage.getItem('token')
             },
            body: JSON.stringify({
              "origin": "webservice",
              "request": {
                "codigoProducto": "T453",
                "datosEntrada": [
                  {
                  "clave": "tipoIdentificacionSujeto",
                  "valor": "C"
                  },
                  {
                  "clave": "identificacionSujeto",
                  "valor": cedulaConyuge
                  }
                ]
              }
            })
          })
        );
      }
     
      // Ejecutar todas las solicitudes en paralelo
      Promise.all(fetchPromises)
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(jsons => {
        const [deudorData, conyugeData] = jsons;
        console.log(deudorData);
                
        // Procesar datos del deudor principal
        if (deudorData.result && deudorData.result.identificacionTitular && deudorData.result.identificacionTitular.length > 0) {
            identificacionSujeto = deudorData.result.identificacionTitular[0].identificacionSujeto;
            nombreRazonSocial = deudorData.result.identificacionTitular[0].nombreRazonSocial;
        }
        if(deudorData.result && deudorData.result.scoreFinanciero && deudorData.result.scoreFinanciero.length > 0){
            score = parseInt(deudorData.result.scoreFinanciero[0].score);
        }
        if(deudorData.result && deudorData.result.factoresScore && deudorData.result.factoresScore.length > 0){
          numOpActuales = parseInt(deudorData.result.factoresScore[0].valor);
          mesesSinVencimientos = parseInt(deudorData.result.factoresScore[2].valor);
          carteraCastigada = parseFloat(deudorData.result.factoresScore[9].valor);
          demandaJudicial= parseFloat(deudorData.result.factoresScore[8].valor);
        }
        if(deudorData.result && deudorData.result.manejoCuentasCorrientes && deudorData.result.manejoCuentasCorrientes.length > 0){
            ctaCorrientes = deudorData.result.manejoCuentasCorrientes[0].accionDescripcion
            if(!ctaCorrientes || ctaCorrientes === "undefined"){
              ctaCorrientes = "No posee restricción"
            }
        }
        if (deudorData.result && deudorData.result.deudaVigenteTotal) {
            deudaVigenteTotal = 0;
            deudorData.result.deudaVigenteTotal.forEach(item => {
                if (item && item.totalDeuda) {
                    deudaVigenteTotal += parseFloat(item.totalDeuda) || 0;
                }
            });
        } else {
            deudaVigenteTotal = 0;
        }
        if (deudaVigenteTotal === 0) {
            cuotaTotal = 0;
        } else if (deudorData.result && deudorData.result.gastoFinanciero && deudorData.result.gastoFinanciero.length > 0) {
            cuotaTotal = parseFloat(deudorData.result.gastoFinanciero[0].cuotaEstimadaTitular) || 0;
        };

        // Procesar datos del cónyuge si existen
        if (conyugeData) {
          if (conyugeData.result && conyugeData.result.identificacionTitular && conyugeData.result.identificacionTitular.length > 0) {
              identificacionConyuge = conyugeData.result.identificacionTitular[0].identificacionSujeto;
              nombresConyuge = conyugeData.result.identificacionTitular[0].nombreRazonSocial;
          }
          if(conyugeData.result && conyugeData.result.scoreFinanciero && conyugeData.result.scoreFinanciero.length > 0){
              scoreConyuge = parseInt(conyugeData.result.scoreFinanciero[0].score);
          }
          if(conyugeData.result && conyugeData.result.factoresScore && conyugeData.result.factoresScore.length > 0){
              numOpActualesConyuge = parseInt(conyugeData.result.factoresScore[0].valor);
              mesesSinVencimientosConyuge = parseInt(conyugeData.result.factoresScore[2].valor);
              carteraCastigadaConyuge = parseFloat(conyugeData.result.factoresScore[9].valor);
              demandaJudicialConyuge= parseFloat(conyugeData.result.factoresScore[8].valor);
          }
          if(conyugeData.result && conyugeData.result.manejoCuentasCorrientes && conyugeData.result.manejoCuentasCorrientes.length > 0){
              ctaCorrientesConyuge = conyugeData.result.manejoCuentasCorrientes[0].accionDescripcion
              if(!ctaCorrientes || ctaCorrientes === "undefined"){
                ctaCorrientesConyuge = "No posee restricción"
              }
          }
          if (conyugeData.result && conyugeData.result.deudaVigenteTotal) {
              deudaVigenteConyuge = 0;
              conyugeData.result.deudaVigenteTotal.forEach(item => {
                  if (item && item.totalDeuda) {
                      deudaVigenteConyuge += parseFloat(item.totalDeuda) || 0;
                  }
              });
          } else {
              deudaVigenteConyuge = 0;
          }
    
          if (deudaVigenteConyuge === 0) {
            cuotaTotalConyuge = 0;
          } else if (conyugeData.result && conyugeData.result.gastoFinanciero && conyugeData.result.gastoFinanciero.length > 0) {
              cuotaTotalConyuge = parseFloat(conyugeData.result.gastoFinanciero[0].cuotaEstimadaTitular) || 0;
          }
          };
        
        //
        //Validaciones con datos de API 
        //

        //Validación SCORE
          function obtenerValorNumerico(categoria) {
            switch(categoria){
              case "AAA": return 3;
              case "AA": return 2;
              case "A": return 1;
              case "Analista": return 0;
              case "Rechazado": return -1;
              default: return 0;
            }
          }
       
        function obtenerDecisionFinal(score, numOpActuales, mesesSinVencimientos, carteraCastigada, demandaJudicial) {  
          let evaScore;
          if(score >=900){
            evaScore = "AAA"
          } else if( score>=800){
            evaScore = "AA"
          } else if( score>=700){
            evaScore = "A"
          } else if( score>=620){
            evaScore = "Analista"
          } else if( score < 620){
            evaScore = "Rechazado"
          };

          let evaNumOpe;
          if(numOpActuales <= 5){
            evaNumOpe = "AAA"
          } else if(numOpActuales > 5 && numOpActuales <7){
            evaNumOpe = "AA"
          } else if(numOpActuales > 7 && numOpActuales <10){
            evaNumOpe = "A"
          } else if(numOpActuales > 10){
            evaNumOpe = "Analista"
          };

          let evaMesesSinVen;
          if(mesesSinVencimientos >= 24){
            evaMesesSinVen = "AAA"
          } else if(mesesSinVencimientos <24 && mesesSinVencimientos >=12){
            evaMesesSinVen = "AA"
          } else if(mesesSinVencimientos <12 && mesesSinVencimientos >=6){
            evaMesesSinVen = "A"
          } else if(mesesSinVencimientos <6){
            evaMesesSinVen = "Analista"
          };       
          
          if (evaScore === "Rechazado" || carteraCastigada > 0 || demandaJudicial > 0) {
            return "Rechazado";
          };

          const total = obtenerValorNumerico(evaScore) +
                obtenerValorNumerico(evaNumOpe) +
                obtenerValorNumerico(evaMesesSinVen);
          const promedio = total / 3;

          let decisionFinal;
          if (promedio >= 2.5){
            decisionFinal = "AAA";
          } else if (promedio >= 1.5){
            decisionFinal = "AA";
          } else if (promedio >= 0.5){
            decisionFinal = "A";
          } else if(promedio < 0.5){
            decisionFinal = "Analista";
          } else if (carteraCastigada > 0 || demandaJudicial > 0){
            decisionFinal = "Rechazado"
          }

          return decisionFinal;
        };      
        const evaluacionIntegral = obtenerDecisionFinal(score, numOpActuales, mesesSinVencimientos);

        let evaIntegralConyuge;

        if(cedulaConyuge){
          function obtenerDecisionFinalCyg(scoreConyuge, numOpActualesConyuge, mesesSinVencimientosConyuge, carteraCastigadaConyuge, demandaJudicialConyuge) {  
          let evaScoreCyg;
          if(scoreConyuge >=900){
            evaScoreCyg = "AAA"
          } else if( scoreConyuge>=800){
            evaScoreCyg = "AA"
          } else if( scoreConyuge>=700){
            evaScoreCyg = "A"
          } else if( scoreConyuge>=620){
            evaScoreCyg = "Analista"
          } else if( scoreConyuge < 620){
            evaScoreCyg = "Rechazado"
          };

          let evaNumOpeCyg;
          if(numOpActualesConyuge <= 5){
            evaNumOpeCyg = "AAA"
          } else if(numOpActualesConyuge > 5 && numOpActualesConyuge <7){
            evaNumOpeCyg = "AA"
          } else if(numOpActualesConyuge > 7 && numOpActualesConyuge <10){
            evaNumOpeCyg = "A"
          } else if(numOpActualesConyuge > 10){
            evaNumOpeCyg = "Analista"
          };

          let evaMesesSinVenCyg;
          if(mesesSinVencimientosConyuge >= 24){
            evaMesesSinVenCyg = "AAA"
          } else if(mesesSinVencimientosConyuge <24 && mesesSinVencimientosConyuge >=12){
            evaMesesSinVenCyg = "AA"
          } else if(mesesSinVencimientosConyuge <12 && mesesSinVencimientosConyuge >=6){
            evaMesesSinVenCyg = "A"
          } else if(mesesSinVencimientosConyuge <6){
            evaMesesSinVenCyg = "Analista"
          };

          if (evaScoreCyg === "Rechazado" || carteraCastigadaConyuge > 0 || demandaJudicialConyuge > 0) {
            return "Rechazado";
          };

          const totalcyg = obtenerValorNumerico(evaScoreCyg) +
                obtenerValorNumerico(evaNumOpeCyg) +
                obtenerValorNumerico(evaMesesSinVenCyg);
          const promediocyg = totalcyg / 3;

          let decisionFinalcyg;
          if (promediocyg >= 2.5){
            decisionFinalcyg = "AAA";
          } else if (promediocyg >= 1.5){
            decisionFinalcyg = "AA";
          } else if (promediocyg >= 0.5){
            decisionFinalcyg = "A";
          } else if (promediocyg < 0.5){
            decisionFinalcyg = "Analista";
          } else if (carteraCastigadaConyuge > 0 || demandaJudicialConyuge > 0){
            decisionFinal = "Rechazado"
          }

          return decisionFinalcyg;
          };      
          evaIntegralConyuge = obtenerDecisionFinalCyg(scoreConyuge, numOpActualesConyuge, mesesSinVencimientosConyuge);
          };
        
        let decisionScore;
        if (evaluacionIntegral == "AAA" || evaluacionIntegral == "AA" || evaluacionIntegral == "A") {
            if (!conyugeData || evaIntegralConyuge == "AAA" || evaIntegralConyuge == "AA" || evaIntegralConyuge == "A") {
                decisionScore = "APROBADO";
            } 
            else if (evaIntegralConyuge == "Analista" || evaIntegralConyuge == "Sin Información") {
                decisionScore = "ANALISTA";
            }
            else if (evaIntegralConyuge == "Rechazado") {
                decisionScore = "RECHAZAR";
            }
        } 
        else if (evaluacionIntegral == "Analista") {
            if (!conyugeData) {
                decisionScore = "ANALISTA";
            }
            else if (evaIntegralConyuge == "AAA" || evaIntegralConyuge == "AA" || evaIntegralConyuge == "A") {
                decisionScore = "ANALISTA";
            }
            else if (evaIntegralConyuge == "Analista" || evaIntegralConyuge == "Sin Información") {
                decisionScore = "ANALISTA";
            }
            else if (evaIntegralConyuge == "Rechazado") {
                decisionScore = "RECHAZAR";
            }
        } 
        else if (evaluacionIntegral == "Rechazado") {
            decisionScore = "RECHAZAR";
        } 
        else if (evaluacionIntegral == "Sin Información") {
            if (!conyugeData) {
                decisionScore = "ANALISTA";
            }
            else if (evaIntegralConyuge == "AAA" || evaIntegralConyuge == "AA" || evaIntegralConyuge == "A") {
                decisionScore = "ANALISTA";
            }
            else if (evaIntegralConyuge == "Analista" || evaIntegralConyuge == "Sin Información") {
                decisionScore = "ANALISTA";
            }
            else if (evaIntegralConyuge == "Rechazado") {
                decisionScore = "RECHAZAR";
            }
        };
       
        //Validación Cartera Castigada
        let decisionCarteraCastigada;
        if (carteraCastigada > 0) {
            decisionCarteraCastigada = "RECHAZADO";
        } 
        else if (conyugeData && carteraCastigadaConyuge > 0) {
            decisionCarteraCastigada = "RECHAZADO";
        } 
        else {
            decisionCarteraCastigada = "OK";
        };

        //Validación Demanda Judicial
        let decisionDemandaJudicial;
        if (demandaJudicial > 0) {
          decisionDemandaJudicial = "RECHAZADO";
        } 
        else if (conyugeData && demandaJudicialConyuge > 0) {
          decisionDemandaJudicial = "RECHAZADO";
        } 
        else {
          decisionDemandaJudicial = "OK";
        };      

        // Validación y cálculo de patrimonio
        let totalPasivos = deudaVigenteTotal + deudaVigenteConyuge;
        let patrimonio = ((activos + valorVehiculo) - totalPasivos).toFixed(2);

        //Monto a financiar
        document.getElementById('monto').value = montoNum.toFixed(2);

        //Cuota financiera deudor
        document.getElementById('gastosFinancierosDeudor').value = cuotaTotal.toFixed(2);
        cuotaTotal = parseFloat(cuotaTotal);

        //Cuota financiera cónyuge
        if(conyugeData){
          document.getElementById('gastosFinancierosConyuge').value = cuotaTotalConyuge.toFixed(2);
          cuotaTotalConyuge = parseFloat(cuotaTotalConyuge);
        };        

        // Cálculo de la cuota mensual
        const interesMensual = 0.1560 / 12;

        //Cálculo de cuota final a financiar
        const gtosLegales = 700;
        const dispositivo = 615; //dispositivo a 3 años
        const seguroDesgravamen = montoNum * 0.021; //2.10% tasa referencial
        const seguroVehicular = valorVehiculo * 0.0409; //4.09% tasa referencial

        // Cálculo de monto a financiar con seguros, gastos legales y dispositivo
        const montoTotal = montoNum + gtosLegales + dispositivo + seguroDesgravamen + seguroVehicular;
        
        // Cálculo de cuota final con seguros, gastos legales y dispositivo
        const cuotaFinal = (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -plazo));

 
        // Cálculo de ingresos y gastos totales
        const ingresoBruto = ingresoDeudor + ingresoConyuge + otrosIngresos;
        
        // Cálculo de gastos familiares
        let gastosFamiliares;
        if(ingresoBruto <= 1500){
          if(!cedulaConyuge){
            gastosFamiliares = 150
          } else {
            gastosFamiliares = 240
          }
        } else{
          if (!cedulaConyuge) {
            gastosFamiliares = ingresoBruto * 0.2;
          } else {
            gastosFamiliares = ingresoBruto * 0.25;
        }
        }     

        // Cálculo del costo adicional por hijos
        let numHijos = 0;
        if(ingresoBruto <= 1500){
          for (let i = 1; i <= hijos; i++) {
            numHijos += 90;
          }
        } else {
          for (let i = 1; i <= hijos; i++) {
            numHijos += ingresoBruto * 0.05;
          }
        }
        const gastosFamiliaresTotales = gastosFamiliares + numHijos;
        document.getElementById('gastosFamiliaresTotales').value = gastosFamiliaresTotales.toFixed(2); 
        const gastosTotales = cuotaTotal + cuotaTotalConyuge + gastosFamiliaresTotales;
        const ingresoNeto = ingresoBruto - gastosTotales;
        const ingresoDisponible = ingresoNeto * 0.50;
        const indicadorEndeudamiento = ingresoDisponible / cuotaFinal;
        const porcEntrada = (entrada/valorVehiculo)*100;

        //Árbol de decisión
        let decisionFinal;
        if(decisionScore == "RECHAZAR" && decisionCarteraCastigada == "OK" && decisionDemandaJudicial == "OK" ){
          decisionFinal = "RECHAZADO"
        } else if((decisionScore == "ANALISTA" || decisionScore == "APROBADO") && decisionCarteraCastigada == "RECHAZADO"){
          decisionFinal = "RECHAZADO"
        } else if((decisionScore == "ANALISTA" || decisionScore == "APROBADO") && decisionCarteraCastigada == "OK" && decisionDemandaJudicial == "RECHAZADO"){
          decisionFinal = "RECHAZADO"
        } else if(decisionScore == "ANALISTA" && decisionCarteraCastigada == "OK" && decisionDemandaJudicial == "OK" && patrimonio > 0 && indicadorEndeudamiento < 1){
          decisionFinal = "ANALISTA CONDICIONADO // JUSTIFICAR INGRESOS ADICIONALES"
        } else if(decisionScore == "ANALISTA" && decisionCarteraCastigada == "OK" && decisionDemandaJudicial == "OK" && patrimonio < 0 && indicadorEndeudamiento < 1){
          decisionFinal = "ANALISTA CONDICIONADO // JUSTIFICAR INGRESOS ADICIONALES  // JUSTIFICAR PATRIMONIO ADICIONAL"
        } else if(decisionScore == "ANALISTA" && decisionCarteraCastigada == "OK" && decisionDemandaJudicial == "OK" && patrimonio > 0 && indicadorEndeudamiento < 1){
          decisionFinal = "ANALISTA CONDICIONADO // JUSTIFICAR INGRESOS ADICIONALES"
        } else if(decisionScore == "ANALISTA" && decisionCarteraCastigada == "OK" && decisionDemandaJudicial == "OK" && patrimonio > 0 && indicadorEndeudamiento > 1){
          decisionFinal = "PRE - APROBADO ANALISTA"
        } else if(decisionScore == "APROBADO" && decisionCarteraCastigada == "OK" && decisionDemandaJudicial == "OK" && patrimonio < 0 && indicadorEndeudamiento < 1){
          decisionFinal = "PRE - APROBADO // JUSTIFICAR INGRESOS ADICIONALES // JUSTIFICAR PATRIMONIO ADICIONAL"
        } else if(decisionScore == "APROBADO" && decisionCarteraCastigada == "OK" && decisionDemandaJudicial == "OK" && patrimonio < 0 && indicadorEndeudamiento > 1){
          decisionFinal = "PRE - APROBADO CONDICIONADO // JUSTIFICAR PATRIMONIO ADICIONAL"
        } else if(decisionScore == "APROBADO" && decisionCarteraCastigada == "OK" && decisionDemandaJudicial == "OK" && patrimonio > 0 && indicadorEndeudamiento < 1){
          decisionFinal = "PRE - APROBADO CONDICIONADO // JUSTIFICAR INGRESOS ADICIONALES"
        } else if(decisionScore == "APROBADO" && decisionCarteraCastigada == "OK" && decisionDemandaJudicial == "OK" && patrimonio > 0 && indicadorEndeudamiento > 1){
          decisionFinal = "PRE - APROBADO"
        } else{
          decisionFinal = "RECHAZADO"
        }

        // Crear el contenido HTML para mostrar los resultados
        const resultadosHTML = `
            <p><strong>Monto a Financiar:</strong> $${montoTotal.toFixed(2)}</p>
            <p><strong>Plazo:</strong> ${plazo} meses</p>
            <p><strong>Tasa:</strong> ${(0.1560 * 100).toFixed(2)}%</p>
            <p><strong>Cuota Mensual:</strong> $${cuotaFinal.toFixed(2)}</p>`;

        // Crear el contenido HTML para mostrar los resultados
        const FinalDecision = `
            <h3><strong>${decisionFinal}</strong>`;
        
        // Mostrar los resultados en el contenedor
        document.getElementById('resultados').innerHTML = resultadosHTML;
        document.getElementById('decision').innerHTML = FinalDecision;
          
        // Datos a guardar en MongoDB
        const datosAnalisis = {
          cedulaDeudor: identificacionSujeto,
          nombreDeudor: nombreRazonSocial,
          scoreDeudor: score,
          evaluacionIntegralDeudor: evaluacionIntegral,
          cedulaConyuge: identificacionConyuge,
          nombreConyuge: nombresConyuge,
          scoreConyuge: scoreConyuge,
          evaluacionIntegralConyuge: evaIntegralConyuge,
          patrimonio: patrimonio,
          ingresos: ingresoBruto,
          gastos: gastosTotales,
          marca: marca,
          modelo: modelo,
          valor: valorVehiculo.toFixed(2),
          entrada: entrada.toFixed(2),
          gtosLegales: gtosLegales,
          dispositivo: dispositivo,
          seguroDesgravamen: seguroDesgravamen.toFixed(2),
          seguroVehicular: seguroVehicular.toFixed(2),
          montoFinanciar: montoTotal.toFixed(2),
          cuotaMensual: cuotaFinal.toFixed(2),
          plazo: plazo,
          indicadorEndeudamiento: indicadorEndeudamiento.toFixed(2),
          decisionFinal: decisionFinal,
          fecha: new Date()
        };

        const fecha = new Date();
        const fechaFormateada = fecha.toISOString().split('T')[0];

        // Enviar al backend
        fetch('https://calcserver-3evg.onrender.com/guardarAnalisis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datosAnalisis)
        })
        .then(res => res.json())
        .then(data => {
          console.log('Análisis guardado en DB:', data);

          // Ahora guardar en Excel
          fetch('https://calcserver-3evg.onrender.com/guardarExcel', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
            body: JSON.stringify({
              fecha: fechaFormateada,
              cedula: identificacionSujeto,
              nombre: nombreRazonSocial,
              cedula_cyg: cedulaConyuge,
              conyuge: nombresConyuge,              
              concesionario: null,
              local: null,
              asesor:null,
              marca: marca,
              modelo: modelo,
              valor:valorVehiculo.toFixed(2),
              entrada: entrada.toFixed(2),
              porcentaje: porcEntrada.toFixed(2),
              seg_desgravamen: seguroDesgravamen.toFixed(2),
              seg_vehicular: seguroVehicular.toFixed(2),
              fideicomiso: gtosLegales.toFixed(2),
              dispositivo: dispositivo.toFixed(2),
              monto_financiar: montoTotal.toFixed(2),
              plazo: plazo,
              score: score,
              score_cyg:scoreConyuge,
              decision: decisionFinal
            })
          })
          .then(res => res.json())
          .then(data => console.log('Datos guardados en Excel:', data))
          .catch(err => console.error('Error al guardar en Excel:', err));
        })
        .catch(err => console.error('Error al guardar análisis:', err));

          const doc = new jsPDF();
          const pageHeight = doc.internal.pageSize.height;
          let y = 20;

          function addLineBreak(lines = 1, lineHeight = 6) {
            y += lines * lineHeight;
            if (y > pageHeight - 20) {
              doc.addPage();
              y = 20;
            }
          }

          // Estilo general
          doc.setFont('helvetica', );
          doc.setFontSize(12);

          // Título
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.setTextColor(0, 0, 128);
          doc.text('RESUMEN DE ANÁLISIS CREDITICIO', 105, y, null, null, 'center');
          addLineBreak(2);

          // DATOS DEL DEUDOR
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 128);
          doc.text('DATOS DEL DEUDOR', 14, y);
          addLineBreak();

          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.text('Nombre:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${nombreRazonSocial}`, 70, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Cédula:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${identificacionSujeto}`, 70, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Score:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${score}`, 70, y);

          doc.setFont('helvetica', 'normal');
          doc.text('Decisión:', 110, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${evaluacionIntegral}`, 160, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('N° operaciones actuales:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${numOpActuales}`, 70, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Meses sin vencimientos:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${mesesSinVencimientos}`, 70, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Cartera castigada:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${carteraCastigada.toFixed(2)}`, 70, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Demanda judicial:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${demandaJudicial.toFixed(2)}`, 70, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Manejo cuentas corrientes:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${ctaCorrientes}`, 70, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Deuda vigente total:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${deudaVigenteTotal.toFixed(2)}`, 70, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Cuota estimada deudor:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${cuotaFinal.toFixed(2)}`, 70, y);
          addLineBreak(2);

          // DATOS DEL CÓNYUGE (si existen)
          if (identificacionConyuge) {
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 128);
            doc.text('DATOS DEL CÓNYUGE', 14, y);
            addLineBreak();

            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.text('Nombre:', 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`${nombresConyuge}`, 70, y);
            addLineBreak();

            doc.setFont('helvetica', 'normal');
            doc.text('Cédula:', 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`${identificacionConyuge}`, 70, y);
            addLineBreak();

            doc.setFont('helvetica', 'normal');
            doc.text('Score:', 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`${scoreConyuge}`, 70, y);

            doc.setFont('helvetica', 'normal');
            doc.text('Decisión:', 110, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`${evaIntegralConyuge}`, 160, y);
            addLineBreak();

            doc.setFont('helvetica', 'normal');
            doc.text('N° operaciones actuales:', 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`${numOpActualesConyuge}`, 70, y);
            addLineBreak();

            doc.setFont('helvetica', 'normal');
            doc.text('Meses sin vencimientos:', 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`${mesesSinVencimientosConyuge}`, 70, y);
            addLineBreak();

            doc.setFont('helvetica', 'normal');
            doc.text('Cartera castigada:', 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`$${carteraCastigadaConyuge.toFixed(2)}`, 70, y);
            addLineBreak();

            doc.setFont('helvetica', 'normal');
            doc.text('Demanda judicial:', 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`$${demandaJudicialConyuge.toFixed(2)}`, 70, y);
            addLineBreak();

            doc.setFont('helvetica', 'normal');
            doc.text('Manejo cuentas corrientes:', 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`${ctaCorrientesConyuge}`, 70, y);
            addLineBreak();

            doc.setFont('helvetica', 'normal');
            doc.text('Deuda vigente total:', 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`$${deudaVigenteConyuge.toFixed(2)}`, 70, y);
            addLineBreak();

            doc.setFont('helvetica', 'normal');
            doc.text('Cuota estimada cónyuge:', 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`$${cuotaTotalConyuge.toFixed(2)}`, 70, y);
            addLineBreak(2);
          }
         
          // RESUMEN DEL CRÉDITO CALCULADO
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 128);
          doc.text('DETALLES DEL CRÉDITO', 14, y);
          doc.text('DETALLES DE VEHÍCULO',104,y);
          addLineBreak();

          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);

          doc.setFont('helvetica', 'normal');
          doc.text('Monto a financiar:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${montoTotal.toFixed(2)}`, 80, y);

          doc.setFont('helvetica', 'normal');
          doc.text('Vehículo:', 110, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${marca}`, 160, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Plazo:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${plazo} meses`, 80, y);

          doc.setFont('helvetica', 'normal');
          doc.text('Modelo:', 110, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${modelo}`, 160, y);
          addLineBreak();          

          doc.setFont('helvetica', 'normal');
          doc.text('Tasa de interés:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${(0.1560 * 100).toFixed(2)}%`, 80, y);

          doc.setFont('helvetica', 'normal');
          doc.text('Valor del Vehículo:', 110, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${valorVehiculo.toFixed(2)}`, 160, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Cuota mensual estimada:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${cuotaFinal.toFixed(2)}`, 80, y);

          doc.setFont('helvetica', 'normal');
          doc.text('Entrada:', 110, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${entrada.toFixed(2)}`, 160, y);
          addLineBreak(2);

          // RESUMEN CAPACIDAD DE PAGO Y PATRIMONIO
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 128);
          doc.text('DETALLES CAPACIDAD DE PAGO', 14, y);
          doc.text('DETALLES PATRIMONIO', 104, y);
          addLineBreak();

          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);

          doc.setFont('helvetica', 'normal');
          doc.text('Ingreso Total:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${ingresoBruto.toFixed(2)}`, 70, y);

          doc.setFont('helvetica', 'normal');
          doc.text('Activos:', 110, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${activos.toFixed(2)}`, 160, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Gastos Familiares:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${gastosFamiliaresTotales.toFixed(2)}`, 70, y);

          doc.setFont('helvetica', 'normal');
          doc.text('Pasivos:', 110, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${totalPasivos.toFixed(2)}`, 160, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Obligaciones Deudor:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${cuotaTotal.toFixed(2)}`, 70, y);

          doc.setFont('helvetica', 'normal');
          doc.text('Patrimonio:', 110, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${parseFloat(patrimonio).toFixed(2)}`, 160, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Obligaciones Cónyuge:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${cuotaTotalConyuge.toFixed(2)}`, 70, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Ingreso Neto:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${ingresoNeto.toFixed(2)}`, 70, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Ingreso Disponible:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`$${ingresoDisponible.toFixed(2)}`, 70, y);
          addLineBreak();

          doc.setFont('helvetica', 'normal');
          doc.text('Indicador:', 20, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`${indicadorEndeudamiento.toFixed(2)}`, 70, y);
          addLineBreak(2);

          // DECISIÓN FINAL EN COLOR DESTACADO
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');

          if (decisionFinal.includes("APROBADO")) {
            doc.setTextColor(0, 128, 0);
          } else if (decisionFinal.includes("ANALISTA")) {
            doc.setTextColor(255, 165, 0);
          } else {
            doc.setTextColor(255, 0, 0);
          }

          doc.text(`${decisionFinal}`, 105, y, null, null, 'center');
          addLineBreak();

          // Restaurar color para texto informativo posterior
          doc.setTextColor(0, 0, 0);

          // Pie de página
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`, 105, pageHeight - 10, null, null, 'center');

          //RESUMEN OPERACIÓN CREDITICIA DESCARGA
          const doc1 = new jsPDF();
          const pageHeight1 = doc1.internal.pageSize.height;
          let y1 = 20;

          function addLineBreak1(lines1 = 1, lineHeight1 = 6) {
            y1 += lines1 * lineHeight1;
            if (y1 > pageHeight1 - 20) {
              doc1.addPage();
              y1 = 20;
            }
          }

          // Estilo general
          doc1.setFont('helvetica', );
          doc1.setFontSize(12);

          // Título
          doc1.setFont('helvetica', 'bold');
          doc1.setFontSize(16);
          doc1.setTextColor(0, 0, 128);
          doc1.text('RESUMEN DE PRECALIFICACIÓN', 105, y1, null, null, 'center');
          addLineBreak1(2);

          // DATOS DEL DEUDOR
          doc1.setFont('helvetica', 'bold');
          doc1.setFontSize(14);
          doc1.setTextColor(0, 0, 128);
          doc1.text('DATOS DEL DEUDOR', 14, y1);
          addLineBreak1();

          doc1.setFontSize(11);
          doc1.setTextColor(0, 0, 0);
          doc1.setFont('helvetica', 'normal');
          doc1.text('Nombre:', 20, y1);
          doc1.setFont('helvetica', 'bold');
          doc1.text(`${nombreRazonSocial}`, 70, y1);
          addLineBreak1();

          doc1.setFont('helvetica', 'normal');
          doc1.text('Cédula:', 20, y1);
          doc1.setFont('helvetica', 'bold');
          doc1.text(`${identificacionSujeto}`, 70, y1);
          addLineBreak1();

          doc1.setFont('helvetica', 'normal');
          doc1.text('Score:', 20, y1);
          doc1.setFont('helvetica', 'bold');
          doc1.text(`${score}`, 70, y1);
          addLineBreak1();          

          // DATOS DEL CÓNYUGE (si existen)
          if (identificacionConyuge) {
            doc1.setFontSize(14);
            doc1.setTextColor(0, 0, 128);
            doc1.text('DATOS DEL CÓNYUGE', 14, y1);
            addLineBreak1();

            doc1.setFontSize(11);
            doc1.setTextColor(0, 0, 0);
            doc1.setFont('helvetica', 'normal');
            doc1.text('Nombre:', 20, y1);
            doc1.setFont('helvetica', 'bold');
            doc1.text(`${nombresConyuge}`, 70, y1);
            addLineBreak1();

            doc1.setFont('helvetica', 'normal');
            doc1.text('Cédula:', 20, y1);
            doc1.setFont('helvetica', 'bold');
            doc1.text(`${identificacionConyuge}`, 70, y1);
            addLineBreak1();

            doc1.setFont('helvetica', 'normal');
            doc1.text('Score:', 20, y1);
            doc1.setFont('helvetica', 'bold');
            doc1.text(`${scoreConyuge}`, 70, y1);
            addLineBreak1();
          }
         
          // RESUMEN DEL CRÉDITO CALCULADO
          doc1.setFontSize(14);
          doc1.setTextColor(0, 0, 128);
          doc1.text('DETALLES DEL CRÉDITO', 14, y1);
          doc1.text('DETALLES DE VEHÍCULO',104,y1);
          addLineBreak1();

          doc1.setFontSize(11);
          doc1.setTextColor(0, 0, 0);

          doc1.setFont('helvetica', 'normal');
          doc1.text('Monto a financiar:', 20, y1);
          doc1.setFont('helvetica', 'bold');
          doc1.text(`$${montoTotal.toFixed(2)}`, 80, y1);

          doc1.setFont('helvetica', 'normal');
          doc1.text('Vehículo:', 110, y1);
          doc1.setFont('helvetica', 'bold');
          doc1.text(`${marca}`, 160, y1);
          addLineBreak1();

          doc1.setFont('helvetica', 'normal');
          doc1.text('Plazo:', 20, y1);
          doc1.setFont('helvetica', 'bold');
          doc1.text(`${plazo} meses`, 80, y1);

          doc1.setFont('helvetica', 'normal');
          doc1.text('Modelo:', 110, y1);
          doc1.setFont('helvetica', 'bold');
          doc1.text(`${modelo}`, 160, y1);
          addLineBreak1();          

          doc1.setFont('helvetica', 'normal');
          doc1.text('Tasa de interés:', 20, y1);
          doc1.setFont('helvetica', 'bold');
          doc1.text(`${(0.1560 * 100).toFixed(2)}%`, 80, y1);

          doc1.setFont('helvetica', 'normal');
          doc1.text('Valor del Vehículo:', 110, y1);
          doc1.setFont('helvetica', 'bold');
          doc1.text(`$${valorVehiculo.toFixed(2)}`, 160, y1);
          addLineBreak1();

          doc1.setFont('helvetica', 'normal');
          doc1.text('Cuota mensual estimada:', 20, y1);
          doc1.setFont('helvetica', 'bold');
          doc1.text(`$${cuotaFinal.toFixed(2)}`, 80, y1);

          doc1.setFont('helvetica', 'normal');
          doc1.text('Entrada:', 110, y1);
          doc1.setFont('helvetica', 'bold');
          doc1.text(`$${entrada.toFixed(2)}`, 160, y1);
          addLineBreak1(2);


          // DECISIÓN FINAL EN COLOR DESTACADO
          doc1.setFontSize(14);
          doc1.setFont('helvetica', 'bold');

          if (decisionFinal.includes("APROBADO")) {
            doc1.setTextColor(0, 128, 0);
          } else if (decisionFinal.includes("ANALISTA")) {
            doc1.setTextColor(255, 165, 0);
          } else {
            doc1.setTextColor(255, 0, 0);
          }

          doc1.text(`${decisionFinal}`, 105, y1, null, null, 'center');
          addLineBreak1();

          // Restaurar color para texto informativo posterior
          doc1.setTextColor(0, 0, 0);

          // Pie de página
          doc1.setFontSize(8);
          doc1.setTextColor(150, 150, 150);
          doc1.text(`Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`, 105, pageHeight1 - 10, null, null, 'center');

          // Guardar el PDF
          const nombreDoc =`Precalificación ${nombreRazonSocial}.pdf`;
          doc1.save(nombreDoc);
 
          // Enviar PDF al backend para envío por correo

          const pdfBase64 = doc.output('datauristring');

          fetch('https://calcserver-3evg.onrender.com/enviarCorreo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pdfBase64: pdfBase64,
              nombreArchivo: `${nombreRazonSocial}.pdf`,
              destinatarios: ['jandrade@tactiqaec.com', 'pmantilla@tactiqaec.com']
            })
          })
          .then(res => res.json())
          .then(data => console.log('Correo enviado:', data))
          .catch(err => console.error('Error al enviar correo:', err));
        })
        .catch(error => console.error('Error en la consulta:', error));
    });
    
    function limpiarFormulario() {
    const inputs = document.querySelectorAll('#app-container input, #app-container select');
    inputs.forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    document.getElementById('monto').value = '';
    document.getElementById('gastosFamiliaresTotales').value = '';
    document.getElementById('gastosFinancierosDeudor').value = '';
    document.getElementById('gastosFinancierosConyuge').value = '';
    document.getElementById('resultados').innerHTML = '';
    document.getElementById('decision').innerHTML = '';
    }

    document.getElementById('new-query-btn').addEventListener('click', limpiarFormulario);

    let timeoutInactividad;

    function reiniciarTemporizador() {
        clearTimeout(timeoutInactividad);
        timeoutInactividad = setTimeout(cerrarSesionAutomatica, 30 * 60 * 1000);
    }

    function cerrarSesionAutomatica() {
        alert("Sesión cerrada por inactividad.");
        document.getElementById('app-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
        localStorage.removeItem('token');
        limpiarFormulario();
    }

    ['click', 'mousemove', 'keydown'].forEach(event => {
        document.addEventListener(event, reiniciarTemporizador);
    });

    reiniciarTemporizador();