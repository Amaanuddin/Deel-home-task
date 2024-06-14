import React, { useState, useEffect } from 'react';
import { getContracts, getUnpaidJobs, payJob, depositBalance, getBestProfession, getBestClients } from './api';
import './App.css';

const App = () => {
  const [contracts, setContracts] = useState([]);
  const [unpaidJobs, setUnpaidJobs] = useState([]);
  const [bestProfession, setBestProfession] = useState([]);
  const [bestClients, setBestClients] = useState([]);

  useEffect(() => {
    fetchContracts();
    fetchUnpaidJobs();
    fetchBestProfession('2020-01-01', '2025-01-01');
    fetchBestClients('2020-01-01', '2025-01-01');
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await getContracts();
      setContracts(response.data);
    } catch (error) {
      console.error('Error fetching contracts', error);
    }
  };

  const fetchUnpaidJobs = async () => {
    try {
      const response = await getUnpaidJobs();
      setUnpaidJobs(response.data);
    } catch (error) {
      console.error('Error fetching unpaid jobs', error);
    }
  };

  const handlePayJob = async (jobId) => {
    try {
      await payJob(jobId);
      fetchUnpaidJobs();
    } catch (error) {
      console.error('Error paying for job', error);
    }
  };

  const handleDepositBalance = async () => {
    try {
      await depositBalance(1, 50); // Assuming userId = 1 and amount = 50 for demo
      fetchContracts();
    } catch (error) {
      console.error('Error depositing balance', error);
    }
  };

  const fetchBestProfession = async (start, end) => {
    try {
      const response = await getBestProfession(start, end);
      setBestProfession(response.data);
    } catch (error) {
      console.error('Error fetching best profession', error);
    }
  };

  const fetchBestClients = async (start, end, limit = 2) => {
    try {
      const response = await getBestClients(start, end, limit);
      setBestClients(response.data);
    } catch (error) {
      console.error('Error fetching best clients', error);
    }
  };

  return (
    <div className="App">
      <h1>API Demo</h1>
      <section>
        <h2>Contracts</h2>
        <ul>
          {contracts.map(contract => (
            <li key={contract.id}>{contract.terms} - Status: {contract.status}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Unpaid Jobs</h2>
        <ul>
          {unpaidJobs.map(job => (
            <li key={job.id}>
              {job.description} - Price: {job.price} - Paid: {job.paid ? 'Yes' : 'No'}
              {!job.paid && <button onClick={() => handlePayJob(job.id)}>Pay</button>}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Deposit Balance</h2>
        <button onClick={handleDepositBalance}>Deposit $50</button>
      </section>

      <section>
        <h2>Best Profession</h2>
        <ul>
          {bestProfession.map(prof => (
            <li key={prof.id}>
              {prof.Contract.Contractor.profession} - Total Earned: {prof.total_earned}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Best Clients</h2>
        <ul>
          {bestClients.map(client => (
            <li key={client.id}>
              {client.fullName} - Paid: {client.paid}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
