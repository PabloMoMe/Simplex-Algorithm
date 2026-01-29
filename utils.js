export function firstIteration(vars, x, independiente, base, z){
    let f_max_AV = getFunctionToMax(x);
    secondIteration(vars, x, independiente, base, z, f_max_AV)
}

export function secondIteration(vars, x, independiente, base, f_max) {
    // Obtener variable que entra
    let max = x[0][x[0].length - 1]
    let index_x = 0

    for (let i = 1; i < x.length; i++) {
        if (max < x[i][x[i].length - 1]) {
            max = x[i][x[i].length - 1]
            index_x = i
        }
    }

    let var_in = vars[index_x]

    // Obtener variable que sale
     let index = 0
    let min = independiente[0] / x[index_x][0]


    for (let i = 1; i < independiente.length; i++) {
        if (min < 0) {
            min = independiente[i] / x[index_x][i];
            index = i
            continue;
        }

        if (independiente[i] / x[index_x][i] < 0) {
            continue;
        }

        if (independiente[i] / x[index_x][i] < min) {
            min = independiente[i] / x[index_x][i]
            index = i
        }
    }

    
    let var_out = base[index]

    // Remplazar variable
    base.splice(base.indexOf(var_out), 1, var_in)

    // Dividir la fila por el pivote
    let pivot = x[index_x][index]

    for (let i = 0; i < x.length; i++) {
        x[i][index] = x[i][index] / pivot
    }

    independiente[index] = independiente[index] / pivot

    // Aplicar las transformaciones de Gauss-Jordan

    for (let i = 0; i < independiente.length; i++) {
        if (i === index) continue;
        let coef = -x[index_x][i];
        independiente[i] = independiente[i] + independiente[index] * coef;
    }

    for (let i = 0; i < x[0].length; i++) {
        if (i === index) continue;
        let coef = -x[index_x][i];
        
        for (let j = 0; j < x.length; j++) {
            x[j][i] = x[j][i] + x[j][index] * coef
        }
    }
    
    //Calcular nuevo valor de z
    let z=calculateZ(f_max, base, independiente)
    
    return [x,independiente,base,z]
}

export function isOptimal(x) {
    for (let i = 0; i < x.length; i++) {
        if (x[i][x[i].length-1]>0) return false;
    }
    return true;
}

export function getFunctionToMax(x) {
    let f_max = []
    for (let i = 0; i < x.length; i++) {
        f_max.push(x[i][x[i].length-1])
    }
    return f_max;
}

export function consoleOut(iteration_number, x , independiente, base, z) {
    console.log("-----------------------------------")
    console.log("Iteracion " + iteration_number.toString() + ":")
    console.log("-----------------------------------")

    console.log("Columnas de la matriz")
    x.forEach(col => console.log("[" + col.toString() + "]"));
    console.log("")

    console.log("Columna independiente")
    console.log("[" + independiente.toString() + "]")
    console.log("")

    console.log("Columna base")
    console.log("[" + base.toString() + "]")
    console.log("")

    console.log("Valor Z")
    console.log(z.toString())
    console.log("")
    
}

export function locateArtificialVars(base) {
    let artificial_vars_pos = [];

    for (let i = 0; i < base.length; i++) {
        if (base[i].charAt(0) == "u") {
            artificial_vars_pos.push(i);
            continue;
        }
    }

    return artificial_vars_pos;
}

export function validateTableAddLastRow(artificial_vars_pos, x) {
    for (let i = 0; i < artificial_vars_pos.length; i++) {
        for (let j = 0; j < x.length; j++) {
            x[j][x[j].length - 1] = x[j][x[j].length - 1] + x[j][artificial_vars_pos[i]]
        }
    }
}

export function calculateZwithArtificialVars(artificial_vars_pos, independiente) {
    let z = 0;

    for (let i = 0; i < artificial_vars_pos.length; i++) {
        z = z - independiente[artificial_vars_pos[i]]
    }

    return z;
}

export function changeObjectiveFunction(f_max, x) {
    for (let i = 0; i < f_max.length; i++) {
        x[i][x[i].length - 1] = f_max[i]
    }

    for (let i = f_max.length; i < x.length; i++) {
        x[i][x[i].length - 1] = 0
    }
}

export function makeZeroToBaseCoeficients(base, vars, x) {
    for (let i = 0; i < base.length; i++) {
        let var_index = vars.indexOf(base[i]);
        if (x[var_index][x[var_index].length - 1] == 0) continue;

        let row_index = 0;
        for (let j = 0; j < x[j].length; j++) {
            if (x[var_index][j] != 0) {
                row_index = j;
                break;
            }
        }

        let coef = -x[var_index][x[var_index].length - 1] / x[var_index][row_index];
        for (let j = 0; j < x.length; j++) {
            x[j][x[j].length - 1] = x[j][x[j].length - 1] + coef * x[j][row_index]
        }
    }
}

export function removeAuxiliarVars(vars, x) {
    let i = vars.length - 1;
    while (vars[i].charAt(0) == "u") {
        x.pop();
        vars.pop();
        i--;
    }
}

export function calculateZ(f_max, base, independiente) {
    let z = 0

    for (let i = 1; i < f_max.length + 1; i++) {
        let isValue = base.indexOf("x" + i.toString())
        let valor = typeof (independiente[isValue]) == 'undefined' ? 0 : independiente[isValue]
        z = z + f_max[i - 1] * valor;
    }

    return -z;
}

export function completeIteration(vars, x, independiente, base, f_max) {
    let iteration_number = 0;
    console.log("------------------------------------------------------")
    console.log("-------------------ALGORITMO SIMPLEX------------------")
    console.log("------------------------------------------------------")
    console.log(" ")

    // Localizar las variables artificiales
    let artificial_vars_pos = locateArtificialVars(base);
    
    //Calcular z
    let z = calculateZwithArtificialVars(artificial_vars_pos, independiente);
    
    consoleOut(iteration_number, x , independiente, base, z)
    iteration_number++;
    
    
    
    console.log("------------------------------------------------------")
    console.log("-----------------VALIDACION DE LA TABLA---------------")
    console.log("------------------------------------------------------")
    console.log(" ")

    // Tabla invalida -> sumar a la ultima fila
    validateTableAddLastRow(artificial_vars_pos, x);

    consoleOut(iteration_number, x , independiente, base, z)
    iteration_number++;


    while (z != 0) {
        firstIteration(vars, x, independiente, base, z)
        artificial_vars_pos = locateArtificialVars(base);
        z = calculateZwithArtificialVars(artificial_vars_pos, independiente)
        consoleOut(iteration_number, x , independiente, base, z)
        
        iteration_number++;
    }
    
    // Eliminar las variables auxiliares
    removeAuxiliarVars(vars, x);

    // Sustituir funcion objetivo
    changeObjectiveFunction(f_max, x);
    
    // Hacer cero los coeficientes de la base
    makeZeroToBaseCoeficients(base, vars, x)
    
    // Calcular nueva z
    z = calculateZ(f_max, base, independiente);
    
    console.log("------------------------------------------------------")
    console.log("-----------------VALIDACION DE LA TABLA---------------")
    console.log("------------------------------------------------------")
    console.log(" ")

    consoleOut(iteration_number, x , independiente, base, z)
    iteration_number++;
    
    console.log("------------------------------------------------------")
    console.log("----------------------SEGUNDA FASE--------------------")
    console.log("------------------------------------------------------")
    console.log(" ")

    secondPhase(vars, x, independiente, base, f_max, iteration_number)
}

export function secondPhase(vars, x, independiente, base, f_max, iteration_number) {
    let z;
    while (!isOptimal(x)){
        [x,independiente,base,z] = secondIteration(vars, x,independiente,base,f_max);
        consoleOut(iteration_number, x , independiente, base, z)
        
        iteration_number++;  
    }
}

export async function loadExample(example_number){
    let data = await fetch('./examples.json')
                        .then(res => res.json())
                        .then(examples => examples.filter(example => example["example_number"] == example_number))
                        .then(example => example[0])
    

    return [data["x"], data["independiente"], data["base"], data["variable_names"], data["f_max_coeficients"]]
}

// Source - https://stackoverflow.com/a
// Posted by Dan Dascalescu, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-29, License - CC BY-SA 4.0

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


