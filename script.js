
// program function 
function algorithmFunction(x, a, b, c, d) {
    return a * x ** 3 + b * x ** 2 + c * x +d;
}

// function to create random chromosome
function randomChromosome(length) {
    return Array.from({ length }, () => Math.random() < 0.5 ? 0 : 1);
}

// function to convert from bit to decimal
function bitsToDecimal(bits) {
    return parseInt(bits.join(''), 2)
}

// function crossover
function crossover(parent1, parent2, Pk) {
    if (Math.random() > Pk) return [parent1, parent2];
    const point = Math.floor(Math.random() * parent1.length);
    const child1 = parent1.slice(0, point).concat(parent2.slice(point));
    const child2 = parent2.slice(0, point).concat(parent1.slice(point));
    return [child1, child2];
}

// function mutatne
function mutate(chromosome, Pm) {
    return chromosome.map(bit => (Math.random() < Pm ? 1 - bit : bit));
}



// main logic

// start button event
document.getElementById("startBtn").addEventListener ("click", () => {
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    const c = parseFloat(document.getElementById("c").value);
    const d = parseFloat(document.getElementById("d").value);
    const Pk = parseFloat(document.getElementById("Pk").value);
    const Pm = parseFloat(document.getElementById("Pm").value);
    const xMin = parseInt(document.getElementById("xMin").value);
    const xMax = parseInt(document.getElementById("xMax").value);
    const populationSize = parseInt(document.getElementById("popSize").value);
    const maxNoChange = parseInt(document.getElementById("maxNoChange").value);

    const bitLength = Math.ceil(Math.log2(xMax - xMin + 1));

    let population = Array.from({ length: populationSize }, () => randomChromosome(bitLength));

    // start population to display
    let initialPopulationText = population.map(ch => `${ch.join('')} (x=${bitsToDecimal(ch)})`).join('\n');

    let bestFitness = -Infinity;
    let bestX = null;
    let noChage = 0;
    let iteration = 0;

    while (noChage < maxNoChange) {
        iteration++;

        // fitness
        const fitness = population.map(ch => algorithmFunction(bitsToDecimal(ch , xMin , xMax), a, b, c, d));

        // the best chromosome
        const maxFitness = Math.max(...fitness);
        const bestIndex = fitness.indexOf(maxFitness);
        const bestChromosome = population[bestIndex];
        const xValue = bitsToDecimal(bestChromosome);

        if (maxFitness > bestFitness) {
            bestFitness = maxFitness;
            bestX = xValue;
            noChage = 0;
        } else {
            noChage++;
        }

        // selection (rule)
        const totalFitness = fitness.reduce((a,b) => a + b, 0);
        const probs = fitness.map(fx => fx / totalFitness);

        const select = () => {
            const r = Math.random();
            let sum = 0;
            for (let i = 0; i < probs.length; i++) {
                sum += probs[i];
                if (r <= sum) return population[i];
            }
            return population[population.length - 1]
        };

        let newPopulation = [];
        for (let i = 0; i < populationSize / 2; i++) {
            const parent1 = select();
            const parent2 = select();
            const [child1, child2] = crossover(parent1, parent2, Pk);
            newPopulation.push(mutate(child1, Pm));
            newPopulation.push (mutate(child2, Pm));
        }
        population = newPopulation;
    }


    // output
    const output = `
    Początkowa populacja: 
    ${initialPopulationText}

    Maksymalna wartość funkcji: ${bestFitness}
    X dla maksymalnej wartości: ${bestX}
    Liczba iteracji: ${iteration}
    `;
    document.getElementById("output").textContent = output;

});