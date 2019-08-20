const express = require('express');

const server = express();

let numberOfRequests = 0;

server.use(express.json());

    const projects = [

                        {
                                    id: 1,
                                    title:'Projeto01',
                        },
                                
                    ];

server.use((req, res, next) => {
    console.time('Done');
    console.log(`Method:${req.method}; URL ${req.url}`);

    next();

    console.timeEnd('Done');
});

function logRequests(req, res, next) {
    numberOfRequests++;
  
    console.log(`Número de requisições: ${numberOfRequests}`);
  
    return next();
  }
  
  server.use(logRequests);

function checkprojectExist(req, res, next){
    if(!req.body.title){
        return res.status(400).json({error:'project title is required'});
    }
    return next();
}

function checkprojectInArray(req, res, next){
    const project = projects[req.params.id];

    if(!project){
        return res.status(400).json({error:"project doesn't exist"});

    }
    req.project = project;

    return next();
}
server.get('/projects', (req,res) => {

    return res.json(projects);

});

server.get('/projects/:id', checkprojectInArray,(req, res) => {

    return res.json(req.project);
    
});

server.post('/projects', checkprojectExist, (req, res) =>{
    const { id } = req.body;
    const { title } = req.body;
    
    projects.push({id: id, title: title});

    return res.json(projects);
});

server.post('/projects/:id/task', checkprojectInArray, (req, res) =>{

    const { id } = req.params;
    const { task } = req.body;

    projects[id].task = task;

    return res.json(projects);
});


server.put('/projects/:id', checkprojectInArray, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects[id].title = title;

    return res.json(projects);
});

server.delete('/projects/:id', checkprojectInArray, (req, res) => {
    const { id } = req.params;

    projects.splice(id, 1);

    return res.json(projects);

});

server.listen(3333);