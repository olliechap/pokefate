const apiUrl = 'https://pokeapi.co/api/v2/pokemon/'
const startBattleButton = document.querySelector('#start-battle-button')

function randomPokemonId() {
    const totalPokemonCount = 1000
    return Math.floor(Math.random() * (totalPokemonCount))
}

async function getPokemonData(pokemonId) {
    try {
        const response = await fetch(apiUrl + pokemonId)

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        return await response.json()

    } catch (error) {
        console.error(error)
    }
}

function getPokemonScore(pokemonData, opponentData) {
    let pokemonScore = 0

    // Get base stats
    pokemonData.stats.forEach(stat => {
        pokemonScore += stat.base_stat
        //console.log(`Stat: ${stat.stat.name}, Score: ${stat.base_stat}`)
    })

    // Apply advantage multiplier
    const typeAdvantage = getTypeAdvantage(pokemonData.types, opponentData.types)
    //console.log(`Advantage: ${typeAdvantage}`)
    pokemonScore *= typeAdvantage

    // Return final score
    //console.log(`${pokemonData.name} score: ${pokemonScore}`)
    return pokemonScore
}

function getTypeAdvantage(attackerTypes, defenderTypes) {
    const typeChart = {
        normal: {
            rock: 0.5, steel: 0.5, ghost: 0
        },
        fire: {
            fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2
        },
        water: {
            fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5
        },
        electric: {
            water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5
        },
        grass: {
            fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5
        },
        ice: {
            fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5
        },
        fighting: {
            normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5
        },
        poison: {
            grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2
        },
        ground: {
            fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2
        },
        flying: {
            electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5
        },
        psychic: {
            fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5
        },
        bug: {
            fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5
        },
        rock: {
            fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5
        },
        ghost: {
            normal: 0, psychic: 2, ghost: 2, dark: 0.5
        },
        dragon: {
            dragon: 2, steel: 0.5, fairy: 0
        },
        dark: {
            fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5
        },
        steel: {
            fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2
        },
        fairy: {
            fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5
        }
    };

    let advantage = 1;

    attackerTypes.forEach(attackerType => {
        const attackTypeName = attackerType.type.name;
        defenderTypes.forEach(defenderType => {
            const defendTypeName = defenderType.type.name;
            if (typeChart[attackTypeName] && typeChart[attackTypeName][defendTypeName]) {
                advantage *= typeChart[attackTypeName][defendTypeName];
            }
        });
    });

    return advantage;
}

async function mainBattle() {
    let pokemonId1 = randomPokemonId()
    let pokemonData1 = await getPokemonData(pokemonId1)
    let pokemonId2 = randomPokemonId()
    let pokemonData2 = await getPokemonData(pokemonId2)

    let pokemonImgElement1 = document.querySelector("#p1-img")
    pokemonImgElement1.src = pokemonData1.sprites.front_default

    let pokemonImgElement2 = document.querySelector("#p2-img")
    pokemonImgElement2.src = pokemonData2.sprites.front_default

    let pokemonNameElement1 = document.querySelector("#p1-name")
    pokemonNameElement1.innerText = pokemonData1.name

    let pokemonNameElement2 = document.querySelector("#p2-name")
    pokemonNameElement2.innerText = pokemonData2.name

    let pokemonScore1 = getPokemonScore(pokemonData1, pokemonData2)
    let pokemonScoreElement1 = document.querySelector("#p1-score")
    pokemonScoreElement1.innerText = pokemonScore1

    let pokemonScore2 = getPokemonScore(pokemonData2, pokemonData1)
    let pokemonScoreElement2 = document.querySelector("#p2-score")
    pokemonScoreElement2.innerText = pokemonScore2

    let pokemonCard1 = document.querySelector("#p1-card")
    let pokemonCard2 = document.querySelector("#p2-card")

    let topHeading = document.querySelector("#top-heading")

    if (pokemonScore1 > pokemonScore2) {
        //alert(`Choice A! ${pokemonData1.name} (${pokemonScore1}) beats ${pokemonData2.name} (${pokemonScore2})`)
        pokemonCard1.classList.add("winner")
        pokemonCard2.classList.remove("winner")
        topHeading.innerText =  `${document.querySelector("#p1-choice").value} Wins!`
    } else if (pokemonScore2 > pokemonScore1) {
        //alert(`Choice B! ${pokemonData2.name} (${pokemonScore2}) beats ${pokemonData1.name} (${pokemonScore1})`)
        pokemonCard2.classList.add("winner")
        pokemonCard1.classList.remove("winner")
        topHeading.innerText =  `${document.querySelector("#p2-choice").value} Wins!`
    } else {
        alert(`It was a tie!`)
    }
}

startBattleButton.addEventListener('click', () => {
    mainBattle()
})