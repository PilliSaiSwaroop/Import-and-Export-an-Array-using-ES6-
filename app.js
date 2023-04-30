const express = require("express");
const path = require("path");

const { open } = require("sqlite"); //connect with db
const sqlite3 = require("sqlite3"); //driver

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeFunction = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server started");
    });
  } catch (e) {
    console.log("Error happen");
    process.exit(1);
  }
};
initializeFunction();

//API CALL FOR LIST OF ALL PLAYERS IN TEAM
app.get("/players/", async (request, response) => {
  const allPlayersQuery = `
  SELECT
    * 
   FROM 
    cricket_team 
   ORDER BY 
    player_id;`;
  const playerList = await db.all(allPlayersQuery);
  response.send(playerList);
});

//API CALL FOR ADD NEW MEMBER
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const player_add_query = `INSERT INTO cricket_team (playerName,jerseyNumber,role)
  VALUES ('${playerName}','${jerseyNumber},'${role}');`;
  const dbResponse = await db.run(player_add_query);
  response.send("Player Added to Team");
});

//API CALL FOR PLAYER BASED ON PLAYER_ID
app.get("/players/:playerId/", async (request, response) => {
  const { player_Id } = request.params;
  const all_players_query = `SELECT * FROM cricket_team WHERE playerId=${player_Id};`;
  const player_list = await db.get(all_players_query);
  response.send(player_list);
});

//API CALL FOR UPDATE PLAYER
app.put("/players/:playerId/", async (request, response) => {
  const player_Details = request.body;
  const { player_Id } = request.params;
  const { playerName, jerseyNumber, role } = player_Details;
  const updatePlayerQuery = `
  UPDATE
    cricket_team
  SET
    playerName='${playerName}',
    jerseyNumber='${jerseyNumber}',
    role='${role}'
  WHERE
    playerId=${player_Id};`;

  const dbResponse = await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//API CALL FOR DELETE PLAYER
app.delete("/players/:playerId/", async (request, response) => {
  const { player_Id } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
        cricket_team
    WHERE
        player_Id = ${player_Id};`;
  const dbResponse = await app.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
