const axios = require('axios');

let randomWikiLink = "https://en.wikipedia.org/api/rest_v1/page/random/summary"
let wikipediaApiURL = "https://en.wikipedia.org/api/rest_v1/page/html/";
let eternalLink = "https://eternal.api.dragonchain.com/v1/transaction/ledger";
let transactionNumber = 0

const getRandomArticle = async () => {
    try {
        return await axios.get(randomWikiLink)
    } catch (error) {
        console.error("Se ha producido un error al recoger el artículo Random de Wikipedia\n")
    }
}

const getArticleData = async(canonical) => {
    try {
        return await axios.get(wikipediaApiURL + canonical + '?redirect=false')
    } catch (error) {
        console.error("Se ha producido un error al recoger el texto del artículo\n")
    }
}

const postToEternal = async(text) => {
    try {
        return await axios.post(eternalLink, {"text": text} )
    } catch (error) {
        console.error("Se ha producido un error al crear la transacción en Eternal\n")
    }
}


const wikier = async() => {
    console.log("Generando artículo aleatorio...")
    const randomArticle = await getRandomArticle()

    if ( randomArticle.data.title) {
        console.log( "Artículo generado: " + randomArticle.data.title )
        const articleData = await getArticleData(randomArticle.data.titles.canonical);

        if ( typeof articleData !== 'undefined' ) {
            console.log("Recogiendo el texto gordo gordo del artículo") 
            const eternalTransaction = await postToEternal(articleData.data)
            console.log( "Guardando en Eternal...")

            if ( eternalTransaction.data.status == 201 ) {
                transactionNumber++
                console.log( "Transacción #" + transactionNumber + " guardada en Eternal con ID de TX: " + 
                    eternalTransaction.data.response.transaction_id + "\n"
                );
            }
        }
    }
}

setInterval( () => {
    wikier()
}, 5000)
