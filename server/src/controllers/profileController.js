const Sequelize = require('sequelize');

const { sequelize } = require('../model')
const {withRetry} = require('../utilities/withRetry')

const depositMoney = async (req, res) => {
    const { userId } = req.params;
    const amount = req.body.amount;
    const {Job, Contract, Profile} = req.app.get('models')

    try {
        await withRetry(async () => {
        const transaction = await sequelize.transaction();

        try {
            const client = await Profile.findByPk(userId, { lock: true, transaction });

            if (!client) {
            await transaction.rollback();
            return res.status(404).end();
            }

            const jobsToPay = await Job.findAll({
            include: {
                model: Contract,
                where: { ClientId: client.id, status: 'in_progress' }
            },
            where: { [Sequelize.Op.or]: [{paid: false}, {paid: null}] },
            transaction
            });

            const totalJobsToPay = jobsToPay.reduce((sum, job) => sum + job.price, 0);
            if (amount > totalJobsToPay * 0.25) {
            await transaction.rollback();
            return res.status(400).send('Deposit exceeds 25% of total jobs to pay');
            }

            client.balance += amount;
            await client.save({ transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        });
        res.status(200).send('Deposit successful');
    } catch (error) {
         res.status(500).send('An error occurred');
    }
};
module.exports = {
    depositMoney
}