const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const {sequelize} = require('./model')
const { getProfile } = require('./middleware/getProfile')

const {contractController, jobsController, profileController, adminController} = require('./controllers')


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.get('/contracts/:id', getProfile, contractController.getContractById);
app.get('/contracts', getProfile, contractController.getAllContracts);

app.get('/jobs/unpaid', getProfile, jobsController.getAllUnpaidJobs);
app.post('/jobs/:job_id/pay', getProfile, jobsController.payJobById);


app.post('/balances/deposit/:userId', getProfile, profileController.depositMoney);

app.get('/admin/best-profession', adminController.bestProfession)
app.get('/admin/best-clients', adminController.bestClients);


module.exports = app;
