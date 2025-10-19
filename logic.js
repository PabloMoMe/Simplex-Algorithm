import {locateArtificialVars, validateTableAddLastRow, calculateZwithArtificialVars, firstIteration, changeObjectiveFunction, makeZeroToBaseCoeficients, removeAuxiliarVars, calculateZ} from "./utils.js"
import {secondIteration, getFunctionToMax, isOptimal, consoleOut} from "./utils.js"
/*
let x=[[2,2,1,0],[1,1,0,0],[1,0,1,0],[1,0,0,0],[0,-1,0,0],[0,0,-1,0],[0,1,0,-1],[0,0,1,-1]]
let independiente=[50,36,10]
let base = ["s1","u2","u3"]
let z=0
let vars=["x1","x2","x3","s1","s2","s3","u2","u3"]
let f_max = [1,1,2]

let x=[[1,-1,2,0],[-1,3,1,0],[0,1,-3,0],[1,0,0,0],[0,-1,0,0],[0,0,-1,0],[0,1,0,-1],[0,0,1,-1]]
let independiente=[1,13,9]
let base = ["s1","u2","u3"]
let z=0
let vars=["x1","x2","x3","s1","s2","s3","u2","u3"]
let f_max = [1,-3,1]
*/

let x=[[2,0,2,0],[1,1,3,0],[-1,0,0,0],[0,-1,0,0],[0,0,1,0],[1,0,0,-1],[0,1,0,-1]]
let independiente=[32,2,60]
let base = ["u1","u2","s3"]
let z=0
let vars=["x1","x2","s1","s2","s3","u1","u2"]
let f_max = [1,-2]

let f_max_AV = getFunctionToMax(x);

// Localizar las variables artificiales
let artificial_vars_pos = locateArtificialVars(base);

// Tabla invalida -> sumar la ultima fila
validateTableAddLastRow(artificial_vars_pos, x);

//Calcular z
z = calculateZwithArtificialVars(artificial_vars_pos, independiente);


while (z != 0) {
    firstIteration(vars, x, independiente, base, z, f_max_AV)
    let artificial_vars_pos = locateArtificialVars(base);
    z = calculateZwithArtificialVars(artificial_vars_pos, independiente)
    consoleOut(-1, x , independiente, base, z)
}

// Sustituir funcion objetivo
changeObjectiveFunction(f_max, x);

// Hacer cero los coeficientes de la base
makeZeroToBaseCoeficients(base, vars, x)

// Eliminar las variables auxiliares
removeAuxiliarVars(vars, x);

// Calcular nueva z
z = calculateZ(f_max, base, independiente);

consoleOut(777, x , independiente, base, z)

let i = 0;
while (!isOptimal(x)){
    [x,independiente,base,z] = secondIteration(vars, x,independiente,base,z,f_max);
    consoleOut(i, x , independiente, base, z)
    i++;
    
}
