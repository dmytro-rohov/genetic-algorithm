## Dokumentacja – Algorytm genetyczny do wyszukiwania maksimum funkcji

### 1. Opis działania programu

Program realizuje prosty algorytm genetyczny, który znajduje przybliżone maksimum funkcji trzeciego stopnia.
Cały proces polega na symulowaniu działania ewolucji: mamy populację rozwiązań (chromosomów), które z czasem „ulepszają się”, aż osiągną najlepszy wynik.

Algorytm działa etapami:

1. Inicjalizacja populacji
2. Obliczanie dopasowania (fitness)
3. Selekcja
4. Krzyżowanie
5. Mutacja
6. Sprawdzenie warunku zakończenia

### 2. Etapy algorytmu

#### 2.1. Inicjalizacja populacji

Na początku tworzymy losową populację chromosomów.
Każdy chromosom to ciąg bitów `(np. 10110)`, który reprezentuje liczbę `x` z określonego zakresu.
Długość chromosomu zależy od szerokości przedziału x i jest liczona dynamicznie:

```js
const bitLength = Math.ceil(Math.log2(xMax - xMin + 1));
let population = Array.from({ length: populationSize }, () => randomChromosome(bitLength));

function randomChromosome(length) {
    return Array.from({ length }, () => Math.random() < 0.5 ? 0 : 1);
}
```
Dzięki temu algorytm działa niezależnie od tego, jaki zakres x ustawi użytkownik.

#### 2.2. Funkcja celu i obliczanie dopasowania

Każdy chromosom (ciąg bitów) jest zamieniany na liczbę dziesiętną, a następnie podstawiany do funkcji `f(x) = a*x³ + b*x² + c*x + d.`
Wartość tej funkcji to tzw. fitness, czyli „jakość” danego rozwiązania.

```js
function algorithmFunction(x, a, b, c, d) {
    return a * x ** 3 + b * x ** 2 + c * x + d;
}

function bitsToDecimal(bits) {
    return parseInt(bits.join(''), 2);
}

const fitness = population.map(ch => algorithmFunction(bitsToDecimal(ch), a, b, c, d));
```
Chromosom z najwyższym wynikiem funkcji jest traktowany jako najlepsze rozwiązanie w danej epoce.

#### 2.3. Selekcja

Selekcja wybiera chromosomy, które będą „rodzicami” dla nowego pokolenia.
Prawdopodobieństwo wyboru zależy od wartości funkcji — im większy fitness, tym większa szansa na wybór.

```js
const totalFitness = fitness.reduce((a, b) => a + b, 0);
const probs = fitness.map(fx => fx / totalFitness);

const select = () => {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < probs.length; i++) {
        sum += probs[i];
        if (r <= sum) return population[i];
    }
    return population[population.length - 1];
};
```
To prosty sposób selekcji zwany ruletką.

#### 2.4. Krzyżowanie

Dwa wybrane chromosomy mogą zostać skrzyżowane, czyli wymieniają między sobą fragmenty bitów.
Dzięki temu nowe chromosomy łączą cechy swoich rodziców.

```js
function crossover(parent1, parent2, Pk) {
    if (Math.random() > Pk) return [parent1, parent2];
    const point = Math.floor(Math.random() * parent1.length);
    const child1 = parent1.slice(0, point).concat(parent2.slice(point));
    const child2 = parent2.slice(0, point).concat(parent1.slice(point));
    return [child1, child2];
}
```
Wartość `Pk` to prawdopodobieństwo krzyżowania — np. `Pk = 0.8` oznacza, że 80% par zostanie skrzyżowanych.

#### 2.5. Mutacja

Po krzyżowaniu u niektórych chromosomów losowo zmienia się pojedynczy bit.
Dzięki mutacji populacja pozostaje zróżnicowana i może uniknąć zastoju w lokalnym maksimum.

```js
function mutate(chromosome, Pm) {
    return chromosome.map(bit => (Math.random() < Pm ? 1 - bit : bit));
}
```
Parametr Pm określa, jak często następuje mutacja (np. Pm = 0.2 oznacza 20% szansy na zmianę każdego bitu).

#### 2.6. Warunek zakończenia

Algorytm zatrzymuje się, gdy przez określoną liczbę epok `(maxNoChange)` nie nastąpi poprawa najlepszego wyniku.
Dzięki temu nie działa w nieskończoność, jeśli wynik się już ustabilizował.

```js
if (maxFitness > bestFitness) {
    bestFitness = maxFitness;
    bestX = xValue;
    noChage = 0;
} else {
    noChage++;
}

while (noChage < maxNoChange) {
    // kolejne iteracje algorytmu
}
```

### 3. Przykład działania

Dla przykładowej funkcji:

```
f(x) = x³ + 2x² + 3x + 4
x ∈ [0, 31]
```

i parametrów:

```
Pk = 0.8
Pm = 0.2
popSize = 6
maxNoChange = 10
```
algorytm po kilku iteracjach może znaleźć:

```
x = 30
f(x) = 34124
```
co oznacza, że `x = 30` jest wartością, dla której funkcja przyjmuje maksimum w tym zakresie.


