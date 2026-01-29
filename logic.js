import {completeIteration, secondPhase, loadExample} from "./utils.js"

let data = await loadExample(4)

let x = data[0]
let independiente = data[1]
let base = data[2]
let variable_names = data[3]
let f_max_coeficients = data[4]

let isfullSimplex = true

if(isfullSimplex){
    completeIteration(variable_names, x, independiente, base, f_max_coeficients)
}
else{
    secondPhase(variable_names, x, independiente, base, z, f_max_coeficients)
}


