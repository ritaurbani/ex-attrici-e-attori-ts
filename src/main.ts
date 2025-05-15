// Milestone 1
// Crea un type alias Person per rappresentare una persona generica.

// Il tipo deve includere le seguenti proprietà:

// id: numero identificativo, non modificabile
// name: nome completo, stringa non modificabile
// birth_year: anno di nascita, numero
// death_year: anno di morte, numero opzionale
// biography: breve biografia, stringa
// image: URL dell'immagine, stringa

type Person = {
  readonly id: number,
  readonly nome: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}

// Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:
// most_famous_movies: una tuple di 3 stringhe
// awards: una stringa
// nationality: una stringa tra un insieme definito di valori.
// Le nazionalità accettate sono: American, British, Australian, Israeli - American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.


type nationalies = 
  |"American"
  |"British"
  |"Australian"
  |"Israeli" 
  |"American"
  |"South African"
  |"French"
  |"Indian"
  |"Israeli"
  |"Spanish"
  |"South Korean"
  |"Chinese"


type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: nationalies
}

// Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:
// GET https://boolean-spec-frontend.vercel.app/freetestapi/actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.
// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.


////controllo se isUtente rispecchia Utente
//questa cosa unknow che ho passato e di tipo Actress on no?
function isActress(result: unknown): result is Actress{ //result is Actress dicitura per creare funzione che ci ritorna un booleano
  if(
    //queste 3 sono condizione di esisteza dei dati
    result && //in realta non c e bisogno chiderci se result esiste se stiamo gia controllando il suo tipo
    typeof result === "object" &&
    result !== null &&
    "id" in result && //c`e`la proprieta id? e se c`e` e un numero?
    typeof result.id === "number" &&
    "name" in result &&
    typeof "name" === "string" &&
    "birth_year" in result &&
    typeof result.birth_year === "number" &&
    "death_year" in result &&
    typeof result.death_year === "number" &&
    "biography" in result &&
    typeof result.biography === "string" &&
    "image" in result &&
    typeof result.image === "string" &&
    "most_famous_movies" in result &&
    //3 condizioni per controllare tuple
    result.most_famous_movies instanceof Array &&
    result.most_famous_movies.length === 3 &&
    //controllo per ogni elem dell array se il suo typeof e stringa
    result.most_famous_movies.every(m => typeof m === "string") &&
    "awards" in result &&
    typeof result.awards === "string" &&
    "nationality" in result &&
        typeof result.nationality === "string"

        result.nationality e incluso in quella array
  ) {
    return true
  } 
   return false
}

//Promise si gestisce con generics
async function getActress(id: number): Promise <Actress|null> {
try{
  const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/actresses/${id}`)

  if(!response.ok){
    throw new Error(`formato dati non valido`)
  }

  const result = await response.json() //type of response.json() is any

  if(!isActress(result)){//se i dati sono falsi ritorna errore
    throw new Error('c`e`un errore')
  }
  return result

}catch(errore){//errore lanciato nel caso in cui non ritorna utente
  if(errore instanceof Error){
    console.error("errore nel recupero dati", errore.message)
}else{
  console.error("errore sconosciuto", errore)
}
return null
}
}

// Milestone 4
// Crea una funzione getAllActresses che chiama:

// GET https://boolean-spec-frontend.vercel.app/freetestapi/actresses
// La funzione deve restituire un array di oggetti Actress.

// Può essere anche un array vuoto.