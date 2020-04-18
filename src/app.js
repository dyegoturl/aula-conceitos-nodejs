const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
 return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();

  const repository = {
    id: id, 
    title: title, 
    url: url, 
    techs: techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);

  
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs }  = request.body;

  if (!isUuid(id)){
    return response.status(400).json({error: "Please provide a valid ID"});
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0){
    return response.status(404).json({error:  "Repository not found"})
  }

  const currentLikes = repositories[repositoryIndex].likes;

  const repository = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: currentLikes,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);


});

app.delete("/repositories/:id", (request, response) => {
 
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({error: "ID inexistente or wrong"});
  }

  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  if (repositoryIndex < 0) {
    return response.status(404).json({error: "ID inexistente"});
  } 

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();


});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;
  if (!isUuid(id)){
    return response.status(400).json({error: "ID inexistente or wrong"});
  }

  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  if (repositoryIndex < 0) {
    return response.status(400).json({error: "ID inexistente"});
  } 

  const currentLikes = repositories[repositoryIndex].likes;
  const totalLikes = currentLikes + 1;
  repositories[repositoryIndex].likes = totalLikes;

  const repository = {
    id: id,
    likes: totalLikes
  }

  return response.json(repository);

});

module.exports = app;
