const Sequelize = require('sequelize');

const { sequelize } = require('../model')
const {withRetry} = require('../utilities/withRetry')



const getAllUnpaidJobs = async (req, res) => {
    const profile = req.profile;
    const {Job, Contract} = req.app.get('models')
    const jobs = await Job.findAll({
        include: {
        model: Contract,
        where: {
            [Sequelize.Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }],
            status: 'in_progress'
        }
        },
        where: {
            [Sequelize.Op.or]: [{paid: false}, {paid: null}]
        
        }
    });

    res.json(jobs);
}

const payJobById =  async (req, res) => {
    const profile = req.profile;
    const {Contract, Job, Profile} = req.app.get('models')
    const { job_id } = req.params;

    try {
        await withRetry(async () => {
            const transaction = await sequelize.transaction();
            try {
                const job = await Job.findOne({
                where: { id: job_id, [Sequelize.Op.or]: [{paid: false}, {paid: null}] },
                include: {
                    model: Contract,
                    where: {
                    ClientId: profile.id,
                    status: 'in_progress'
                    }
                },
                lock: true,
                transaction
                });

                if (!job) {
                await transaction.rollback();
                return res.status(404).end();
                }

                const contract = job.Contract;
                const contractor = await Profile.findByPk(contract.ContractorId, { lock: true, transaction });
                const client = await Profile.findByPk(profile.id, { lock: true, transaction });

                if (client.balance < job.price) {
                await transaction.rollback();
                return res.status(400).send('Insufficient balance');
                }

                client.balance -= job.price;
                contractor.balance += job.price;
                job.paid = true;
                job.paymentDate = new Date();

                await client.save({ transaction });
                await contractor.save({ transaction });
                await job.save({ transaction });

                await transaction.commit();
                res.status(200).send('Payment successful');
            } catch (error) {
                await transaction.rollback();
                res.status(500).send('An error occurred');
            }
        })
    }
    catch (error) {
        await transaction.rollback();
        res.status(500).send('An error occurred');
    }
    
};

module.exports = {
    getAllUnpaidJobs,
    payJobById
}