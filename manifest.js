import WebTorrent from "webtorrent";
import express from "express";

const app = express(); // Serveur Express pour gérer les téléchargements
const client = new WebTorrent(); // Client WebTorrent

// Endpoint pour télécharger un fichier
app.get("/download", (req, res) => {
    const torrent = req.query.torrent; // Lien torrent (magnet ou fichier .torrent)
    const fileName = req.query.file; // Nom du fichier à télécharger

    if (!torrent || !fileName) {
        return res.status(400).send("Paramètres manquants");
    }

    // Ajouter le torrent au client
    client.add(torrent, (torrent) => {
        // Trouver le fichier dans le torrent
        const file = torrent.files.find(f => f.name === fileName);

        if (file) {
            // Envoyer le fichier au client
            res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
            file.createReadStream().pipe(res);
        } else {
            res.status(404).send("Fichier non trouvé dans le torrent");
        }
    });
});

// Lancer le serveur Express
app.listen(7000, () => console.log("Serveur de téléchargement actif sur http://localhost:7000"));