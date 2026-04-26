const ImageKit = require("imagekit");

module.exports = async (req, res) => {
  // 1. Permessi CORS universali per far passare le foto
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Gestione pre-flight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 2. Inizializziamo ImageKit DENTRO la funzione, così siamo sicuri che legga le chiavi
    const imagekit = new ImageKit({
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY,
      urlEndpoint: process.env.URL_ENDPOINT
    });

    // 3. Generazione del lasciapassare
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.status(200).json(authenticationParameters);

  } catch (error) {
    // Se c'è un errore, ora il server ci dirà in chiaro qual è il problema!
    res.status(500).json({ 
      errore: "Il server è crashato", 
      dettaglio: error.message 
    });
  }
};
