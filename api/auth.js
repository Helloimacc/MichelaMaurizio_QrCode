const ImageKit = require("imagekit");

module.exports = async (req, res) => {
  // 1. Permessi universali
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 2. Leggiamo le chiavi da Vercel
    const pub = process.env.PUBLIC_KEY;
    const priv = process.env.PRIVATE_KEY;
    const url = process.env.URL_ENDPOINT;

    // 3. LO SCANNER A RAGGI X: Controlliamo se Vercel ce le ha date
    if (!pub || !priv || !url) {
        return res.status(500).json({
            errore: "⚠️ Vercel non sta leggendo le variabili di ambiente!",
            dettaglio_chiavi: {
                PUBLIC_KEY: pub ? "✅ Trovata" : "❌ MANCANTE",
                PRIVATE_KEY: priv ? "✅ Trovata" : "❌ MANCANTE",
                URL_ENDPOINT: url ? "✅ Trovata" : "❌ MANCANTE"
            }
        });
    }

    // 4. Se ci sono tutte, accendiamo ImageKit
    const imagekit = new ImageKit({
      publicKey: pub,
      privateKey: priv,
      urlEndpoint: url
    });

    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.status(200).json(authenticationParameters);

  } catch (error) {
    res.status(500).json({ 
      errore: "Errore di ImageKit", 
      dettaglio: error.message 
    });
  }
};
