const { request, response } = require('express');
const express = require('express');

const { v4: uuidV4 } = require("uuid");


const app = express();

const customers = [];

//Middleware

function CheckAccountExistsByCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customer not found" });
  }

  request.customer = customer;
  return next();
}
app.use(express.json());



app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customers) => customers.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists!" })
  }

  customers.push({
    cpf,
    name,
    id: uuidV4(),
    statement: []
  })
  return response.status(201).send();
});

// app.get("/statement/:cpf", (request, response) => {
//   const {cpf} = request.params;

// no Insominia passar o cpf pelo header

// app.use(CheckAccountExistsByCPF);
app.get("/statement", CheckAccountExistsByCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

// app.get("/courses", (request, response) => {
//   return response.json(["Curso1","Curso2","Curso3"]);
// });

// app.post("/courses", (request, response) => {
//   return response.json(["Curso1", "Curso2", "Curso3", "Curso4"]);
// });

// app.put("/courses/:id", (request, response) => {
//   return response.json(["Curso5", "Curso2", "Curso3", "Curso4"]);
// });

// app.patch("/courses/:id", (request, response) => {
//   return response.json(["Curso5", "Curso2", "Curso3", "Curso4"]);
// });

// app.delete("/courses/:id", (request, response) => {
//   return response.json(["Curso5", "Curso2", "Curso3", "Curso4"]);
// });

app.listen(3333);