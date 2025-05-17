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

//se era tipo di oggetto ci volevano le graffe altrimenti come qui non ci vogliono
//tipo union di stringhe letterali. Definisce i valori singoli consentiti
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

  //array di tipo nationalities, cioe array di valori specifici consentiti, cioe quelle sopra
// Array che può contenere solo valori di tipo nationalies
const allowedNationalities: nationalies[] = ["American", "British", "Australian", "Israeli", "South African", "French", "Indian", "Spanish", "South Korean", "Chinese"];


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

// La funzione isActress è una type guard (guardia di tipo) che verifica 
// se un oggetto sconosciuto(unknown) rispetta la struttura del tipo Actress.
// In pratica, controlla due cose:
// Forma dell'oggetto: Presenza di tutte le proprietà obbligatorie
// Tipi dei valori: Corrispondenza dei tipi dichiarati(es.id deve essere number)

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
    typeof result.name === "string" &&
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
    typeof result.nationality === "string" &&

//Verifichi che la proprietà esista ✅
//Verifichi che sia una stringa ✅
//Verifichi che il valore sia nell'array delle nazionalità consentite ✅
//Solo allora fai l'asserzione, perché hai già la certezza che il valore sia valido 🔒
//TYPE ASSERTION:
//as significa: so per certo che result.nationality e`una delle stringhe nel tipo nationalies, delle nationalities consentite
//anche se tecnicamente e una stringa generica
allowedNationalities.includes(result.nationality as nationalies))
// Verifichiamo se il valore di result.nationality è presente nell'array allowedNationalities.
  // allowedNationalities.includes("Russian") // → false → la funzione ritorna false
// Se NON è presente(!indica negazione), ritorniamo false perché la nazionalità non è valida.
// result.nationality e incluso in quella array
   {
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

async function getAllActresses():Promise <Actress[]> { //array di Actress, null non serve perche ritornera un array vuoto quando non trova nessun attrice
 try{
   const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/actresses`)
   if(!response.ok){
    throw new Error(`errore http${response.status}: ${response.statusText}`)//errore catturato e return array vuoto
   }
   const dati:unknown = await response.json()
   //1.controllo se e array
   if(!(dati instanceof Array)) //dati non e un array - if(!Array.isArray(dati))
   {
    throw new Error("errnon e un array")
   }
   //2. controllo se e` array di attrici > filtro tutto cio che e'attrice e se non lo e' lo togliamo

   //filteredActresses e uguale a array di attrici - a filter ci passiamo la callback isActress(ritorna booleano)
   //per ogni attrice ritornami isActress di attrice -  Filtra solo gli elementi validi usando la type guard
   const filteredActresses: Actress[] = dati.filter((a) => isActress(a)) //dati.filter(isActress)
   //la funzione isActress sa che stiamo parlando di array quindi questo :Acress[] possiamo anche toglierlo
   return filteredActresses //ora array e pulito
 }catch(error) {
  if(error instanceof Error){
    console.error('errore durante recupero dell attrice', error)
  }else{
    console.error("errore sconosciuto", error)
  }
  return []
 }
}

// Milestone 5
// Crea una funzione getActresses che riceve un array di numeri(gli id delle attrici).
// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.
// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.
// La funzione deve restituire un array contenente elementi di tipo Actress oppure null(se l’attrice non è stata trovata).

// Per ogni ID, la funzione cerca di ottenere i dati dell’attrice(con una funzione chiamata getActress)
// e restituisce un array di attrici(Actress) o null, mantenendo l'ordine originale degli ID.

async function getActresses(ids:number[]):Promise <(Actress | null) []> {//array anche vuoto con ciascun elemento che puo essere actress o null
try{//creo array di promesse a partire da array di ids > per ogni id devo fare fetch e ottenere response
 const promises = ids.map((id) => getActress(id))

//  promises = [
//   getActress(1),//restituisce una promess
//   getActress(2),
//  ]

 const actresses = await Promise.all(promises) //aspetta che tutte le promesse siano completate - await ferma esecuzione finche completate
  return actresses; //[Actress, null, Actress]
} catch (error) {
  if (error instanceof Error) {
    console.error('errore durante recupero dell attrice', error)
  } else {
    console.error("errore sconosciuto", error)
  }
  return []
}
}